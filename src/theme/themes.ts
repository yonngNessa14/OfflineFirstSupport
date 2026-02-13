import {colors} from './colors';

export interface Theme {
  dark: boolean;
  colors: {
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
      inverse: string;
    };
    border: string;
    button: {
      small: {
        background: string;
        text: string;
      };
      large: {
        background: string;
        text: string;
      };
    };
    badge: {
      small: {
        background: string;
        text: string;
      };
      large: {
        background: string;
        text: string;
      };
    };
    status: {
      online: string;
      offline: string;
      pending: {
        background: string;
        text: string;
      };
      synced: {
        background: string;
        text: string;
      };
    };
    shadow: string;
  };
}

export const lightTheme: Theme = {
  dark: false,
  colors: {
    background: colors.gray[100],
    surface: colors.white,
    text: {
      primary: colors.gray[900],
      secondary: colors.gray[600],
      disabled: colors.gray[400],
      inverse: colors.white,
    },
    border: colors.gray[300],
    button: {
      small: {
        background: colors.green.main,
        text: colors.white,
      },
      large: {
        background: colors.blue.main,
        text: colors.white,
      },
    },
    badge: {
      small: {
        background: colors.green.light,
        text: colors.gray[900],
      },
      large: {
        background: colors.blue.light,
        text: colors.gray[900],
      },
    },
    status: {
      online: colors.green.main,
      offline: colors.red.main,
      pending: {
        background: colors.orange.light,
        text: colors.orange.dark,
      },
      synced: {
        background: colors.green.light,
        text: colors.green.dark,
      },
    },
    shadow: colors.black,
  },
};

export const darkTheme: Theme = {
  dark: true,
  colors: {
    background: colors.dark.background,
    surface: colors.dark.surface,
    text: {
      primary: colors.white,
      secondary: colors.gray[400],
      disabled: colors.gray[600],
      inverse: colors.gray[900],
    },
    border: colors.gray[700],
    button: {
      small: {
        background: colors.green.dark,
        text: colors.white,
      },
      large: {
        background: colors.blue.dark,
        text: colors.white,
      },
    },
    badge: {
      small: {
        background: colors.green.darkBg,
        text: colors.green.light,
      },
      large: {
        background: colors.blue.darkBg,
        text: colors.blue.light,
      },
    },
    status: {
      online: colors.green.main,
      offline: colors.red.main,
      pending: {
        background: colors.orange.darkBg,
        text: colors.orange.main,
      },
      synced: {
        background: colors.green.darkBg,
        text: colors.green.main,
      },
    },
    shadow: colors.black,
  },
};
