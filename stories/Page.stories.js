import * as HeaderStories from './Header.stories';
import { Page } from '../Components/Page';

export default {
  title: 'Components/Page',
  render: (args) => Page(args),
};

export const LoggedIn = {
  args: {
    // More on composing args: https://storybook.js.org/docs/writing-stories/args#args-composition
    ...HeaderStories.LoggedIn.args,
  },
};

export const LoggedOut = {
  args: {
    ...HeaderStories.LoggedOut.args,
  },
};
