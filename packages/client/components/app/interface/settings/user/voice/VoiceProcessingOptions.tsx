import { Trans } from "@lingui-solid/solid/macro";
import { batch } from "solid-js"; 
import { useState } from "@revolt/state";
import { CategoryButton, Checkbox, Column, Text } from "@revolt/ui";

/**
 * Voice processing options
 */
export function VoiceProcessingOptions() {
  const state = useState();

  return (
    <Column>
      <Text class="title">
        <Trans>Voice Processing</Trans>
      </Text>
      <CategoryButton.Group>
        <CategoryButton
          icon="blank"
          action={<Checkbox checked={state.voice.noiseSupression} />}
          onClick={() => {
            batch(() => {
              const nextValue = !state.voice.noiseSupression;
              state.voice.noiseSupression = nextValue;
              // If we turn on Browser suppression, turn off RNNoise
              if (nextValue) {
                state.voice.rnnoise = false;
              }
            });
          }}
        >
          <Trans>Browser Noise Supression</Trans>
        </CategoryButton>
        
        <CategoryButton
          icon="blank"
          action={<Checkbox checked={state.voice.rnnoise} />}
          onClick={() => {
            batch(() => {
              const nextValue = !state.voice.rnnoise;
              state.voice.rnnoise = nextValue;
              // If we turn on RNNoise, turn off Browser suppression
              if (nextValue) {
                state.voice.noiseSupression = false;
              }
            });
          }}
        >
          <Trans>Enhanced Noise Suppression Powered by RNNoise</Trans>
        </CategoryButton>

        <CategoryButton
          icon="blank"
          action={<Checkbox checked={state.voice.echoCancellation} />}
          onClick={() =>
            (state.voice.echoCancellation = !state.voice.echoCancellation)
          }
        >
          <Trans>Browser Echo Cancellation</Trans>
        </CategoryButton>
      </CategoryButton.Group>
    </Column>
  );
}