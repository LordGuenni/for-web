import { onCleanup } from "solid-js";
import type { Channel, Client } from "stoat.js";
import { VoiceParticipant } from "stoat.js";

/**
 * Poll voice channel participants from the API
 * 
 * Workaround for backend limitation where voice events are only sent to channel subscribers.
 * This polls the /channels/{id}/voice endpoint to get current participants.
 * 
 * @param client - Stoat client instance
 * @param channels - Function returning list of channels to poll
 * @param intervalMs - Polling interval in milliseconds (default: 5000)
 */
export function pollVoiceParticipants(
  client: Client,
  channels: () => Channel[],
  intervalMs = 5000
) {
  const poll = async () => {
    const channelList = channels();
    
    for (const channel of channelList) {
      try {
        // Fetch voice state for this channel
        const response = await client.api.get(
          `/channels/${channel.id}/voice` as `/channels/${string}/voice`
        );

        if (response && response.participants) {
          // Update the channel's voiceParticipants map
          // Clear existing participants first
          const existingIds = new Set(channel.voiceParticipants.keys());
          const newIds = new Set(response.participants.map((p: any) => p.id));

          // Remove participants who left
          for (const id of existingIds) {
            if (!newIds.has(id)) {
              channel.voiceParticipants.delete(id);
            }
          }

          // Add or update participants
          for (const participantData of response.participants) {
            const existing = channel.voiceParticipants.get(participantData.id);
            
            if (existing) {
              // Update existing participant
              existing.update(participantData);
            } else {
              // Add new participant
              channel.voiceParticipants.set(
                participantData.id,
                new VoiceParticipant(client, participantData)
              );
            }
          }

          console.log(
            `[VoicePolling] Updated ${channel.name || channel.id}: ${response.participants.length} participants`
          );
        } else if (response === null || (response && response.participants?.length === 0)) {
          // No participants, clear the map
          if (channel.voiceParticipants.size > 0) {
            channel.voiceParticipants.clear();
            console.log(`[VoicePolling] Cleared ${channel.name || channel.id}: empty`);
          }
        }
      } catch (error) {
        // Silently ignore errors (likely 404 if endpoint doesn't exist yet)
        // or permission errors
        if (error && typeof error === 'object' && 'status' in error && error.status !== 404) {
          console.warn(`[VoicePolling] Error fetching voice for channel ${channel.id}:`, error);
        }
      }
    }
  };

  // Start polling
  const interval = setInterval(poll, intervalMs);

  // Initial poll
  poll();

  // Return cleanup function
  return () => clearInterval(interval);
}

/**
 * SolidJS hook to poll voice participants for visible voice channels
 * 
 * @param client - Stoat client instance
 * @param getChannels - Function that returns the list of visible voice channels to poll
 * @param intervalMs - Polling interval (default: 5000ms)
 */
export function useVoiceParticipantPolling(
  client: Client,
  getChannels: () => Channel[],
  intervalMs = 5000
) {
  // Set up polling and cleanup on component unmount
  const cleanup = pollVoiceParticipants(client, getChannels, intervalMs);
  onCleanup(cleanup);
}
