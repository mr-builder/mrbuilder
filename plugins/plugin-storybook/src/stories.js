import './parameters';
import { configure } from '@storybook/react';
configure(require.context(MRBUILDER_PLUGIN_STORYBOOK_DIR, true, MRBUILDER_PLUGIN_STORYBOOK_TEST), module);
