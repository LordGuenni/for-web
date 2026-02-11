import { Show } from "solid-js";

import { styled } from "styled-system/jsx";

import { useClient } from "@revolt/client";
import { useVoice } from "@revolt/rtc";
import { Avatar, IconButton } from "@revolt/ui/components/design";
import { Symbol } from "@revolt/ui/components/utils/Symbol";

/**
 * Discord-like persistent voice controls in bottom-left corner
 * Shows when user is connected to a voice channel
 */
export function PersistentVoiceControls() {
  const voice = useVoice();
  const client = useClient();

  return (
    <Show when={voice.room()}>
      <Container>
        <UserInfo>
          <Avatar
            size={32}
            src={client().user!.animatedAvatarURL}
            fallback={client().user!.displayName}
            interactive={false}
          />
          <UserDetails>
            <Username>{client().user!.displayName}</Username>
            <ChannelName>{voice.channel()?.name || "Voice Channel"}</ChannelName>
          </UserDetails>
        </UserInfo>

        <Controls>
          <IconButton
            size="sm"
            variant={voice.microphone() ? "filled" : "tonal"}
            onPress={() => voice.toggleMute()}
            use:floating={{
              tooltip: voice.speakingPermission
                ? {
                    placement: "top",
                    content: voice.microphone() ? "Mute" : "Unmute",
                  }
                : {
                    placement: "top",
                    content: "Missing permission",
                  },
            }}
            isDisabled={!voice.speakingPermission}
          >
            <Show when={voice.microphone()} fallback={<Symbol>mic_off</Symbol>}>
              <Symbol>mic</Symbol>
            </Show>
          </IconButton>

          <IconButton
            size="sm"
            variant={voice.deafen() || !voice.listenPermission ? "tonal" : "filled"}
            onPress={() => voice.toggleDeafen()}
            use:floating={{
              tooltip: voice.listenPermission
                ? {
                    placement: "top",
                    content: voice.deafen() ? "Undeafen" : "Deafen",
                  }
                : {
                    placement: "top",
                    content: "Missing permission",
                  },
            }}
            isDisabled={!voice.listenPermission}
          >
            <Show
              when={voice.deafen() || !voice.listenPermission}
              fallback={<Symbol>headset</Symbol>}
            >
              <Symbol>headset_off</Symbol>
            </Show>
          </IconButton>

          <IconButton
            size="sm"
            variant={voice.video() ? "filled" : "tonal"}
            onPress={() => voice.toggleCamera()}
            use:floating={{
              tooltip: {
                placement: "top",
                content: voice.video() ? "Stop Camera" : "Start Camera",
              },
            }}
          >
            <Show when={voice.video()} fallback={<Symbol>videocam_off</Symbol>}>
              <Symbol>videocam</Symbol>
            </Show>
          </IconButton>

          <IconButton
            size="sm"
            variant={voice.screenshare() ? "filled" : "tonal"}
            onPress={() => voice.toggleScreenshare()}
            use:floating={{
              tooltip: {
                placement: "top",
                content: voice.screenshare() ? "Stop Sharing" : "Share Screen",
              },
            }}
          >
            <Show
              when={voice.screenshare()}
              fallback={<Symbol>stop_screen_share</Symbol>}
            >
              <Symbol>screen_share</Symbol>
            </Show>
          </IconButton>

          <IconButton
            size="sm"
            variant="_error"
            onPress={() => voice.disconnect()}
            use:floating={{
              tooltip: {
                placement: "top",
                content: "Disconnect",
              },
            }}
          >
            <Symbol>call_end</Symbol>
          </IconButton>
        </Controls>
      </Container>
    </Show>
  );
}

const Container = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--gap-sm)",

    padding: "var(--gap-md)",
    margin: "var(--gap-md)",
    marginTop: "auto",

    borderRadius: "var(--borderRadius-lg)",
    background: "var(--md-sys-color-surface-container)",
  },
});

const UserInfo = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-md)",
  },
});

const UserDetails = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    flexGrow: 1,
  },
});

const Username = styled("span", {
  base: {
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--md-sys-color-on-surface)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
});

const ChannelName = styled("span", {
  base: {
    fontSize: "12px",
    color: "var(--md-sys-color-on-surface-variant)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
});

const Controls = styled("div", {
  base: {
    display: "flex",
    gap: "var(--gap-xs)",
    justifyContent: "space-between",
  },
});
