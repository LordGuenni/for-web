import { Trans } from "@lingui-solid/solid/macro";
import { batch } from "solid-js";
import { useState } from "@revolt/state";
import { CategoryButton, Checkbox, Column, Text } from "@revolt/ui";

export function VoiceProcessingOptions() {
  const state = useState();

  return (
    <Column>
      <Text class="title">
        <Trans>Voice Processing</Trans>
      </Text>
      <CategoryButton.Group>
        {/* Browser Noise Suppression */}
        <CategoryButton
          icon="blank"
          // pointer-events: none prevents the checkbox from intercepting clicks
          action={<Checkbox checked={state.voice.noiseSupression} style={{ "pointer-events": "none" }} />}
          onClick={() => {
            batch(() => {
              const nextValue = !state.voice.noiseSupression;
              state.voice.noiseSupression = nextValue;
              if (nextValue) state.voice.rnnoise = false;
            });
          }}
        >
          <Trans>Browser Noise Supression</Trans>
        </CategoryButton>

        {/* RNNoise */}
        <CategoryButton
          icon="blank"
          action={<Checkbox checked={state.voice.rnnoise} style={{ "pointer-events": "none" }} />}
          onClick={(e) => {
            // Stop the checkbox from double-triggering
            e.preventDefault(); 
            batch(() => {
              const nextValue = !state.voice.rnnoise;
              state.voice.rnnoise = nextValue;
              if (nextValue) state.voice.noiseSupression = false;
            });
          }}
        >
          <Trans>Enhanced Noise Suppression Powered by RNNoise</Trans>
        </CategoryButton>

        {/* Echo Cancellation */}
        <CategoryButton
          icon="blank"
          action={<Checkbox checked={state.voice.echoCancellation} style={{ "pointer-events": "none" }} />}
          onClick={() => {
            state.voice.echoCancellation = !state.voice.echoCancellation;
          }}
        >
          <Trans>Browser Echo Cancellation</Trans>
        </CategoryButton>
      </CategoryButton.Group>
    </Column>
  );
}