import { Trans } from "@lingui-solid/solid/macro";

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
            if (!state.voice.noiseSupression) {
              state.voice.noiseSupression = true;
              state.voice.rnnoise = false;
            } else {
              state.voice.noiseSupression = false;
            }
          }}
        >
          <Trans>Browser Noise Supression</Trans>
        </CategoryButton>
        <CategoryButton
          icon="blank"
          action={<Checkbox checked={state.voice.rnnoise} />}
          onClick={() => {
            if (!state.voice.rnnoise) {
              state.voice.rnnoise = true;
              state.voice.noiseSupression = false;
            } else {
              state.voice.rnnoise = false;
            }
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
