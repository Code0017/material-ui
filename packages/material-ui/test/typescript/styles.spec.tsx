import * as React from 'react';
import {
  withStyles,
  createTheme,
  Theme,
  StyleRulesCallback,
  WithStyles,
  ThemeProvider,
} from '@material-ui/core/styles';
import { createStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import { blue } from '@material-ui/core/colors';

// Shared types for examples
interface SimpleComponentProps extends WithStyles<typeof simpleStyles> {
  text: string;
}

// Example 1
const simpleStyles = ({ palette, spacing }: Theme) => ({
  root: {
    padding: spacing(1),
    backgroundColor: palette.background.default,
    color: palette.primary.dark,
  },
});

const StyledExampleOne = withStyles(simpleStyles)(({ classes, text }: SimpleComponentProps) => (
  <div className={classes.root}>{text}</div>
));
<StyledExampleOne text="I am styled!" />;

// Example 2
const SimpleComponent: React.FunctionComponent<
  SimpleComponentProps & WithStyles<typeof simpleStyles>
> = ({ classes, text }) => <div className={classes.root}>{text}</div>;

const StyledExampleTwo = withStyles(simpleStyles)(SimpleComponent);
<StyledExampleTwo text="I am styled!" />;

// Example 3
const styleRule = createStyles({
  root: {
    display: 'flex',
    alignItems: 'stretch',
    height: '100vh',
    width: '100%',
  },
});

const ComponentWithChildren: React.FunctionComponent<WithStyles<typeof simpleStyles>> = ({
  classes,
  children,
}) => <div className={classes.root}>{children}</div>;

const StyledExampleThree = withStyles(styleRule)(ComponentWithChildren);
<StyledExampleThree />;

// Also works with a plain object
const stylesAsPojo = {
  root: {
    backgroundColor: 'hotpink',
  },
};

const AnotherStyledSFC = withStyles({
  root: { backgroundColor: 'hotpink' },
})(({ classes }: WithStyles<'root'>) => <div className={classes.root}>Stylish!</div>);

{
  // Overriding styles
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: blue,
      contrastThreshold: 3,
      tonalOffset: 0.2,
      common: {
        white: '#ffffff',
      },
    },
    typography: {
      h1: {
        fontSize: 24,
      },
      fontSize: 18,
    },
    mixins: {
      toolbar: {
        backgroundColor: 'red',
      },
    },
    breakpoints: {
      step: 3,
    },
    transitions: {
      duration: {
        short: 50,
      },
    },
    spacing: 5,
    zIndex: {
      appBar: 42,
    },
    components: {
      MuiButton: {
        defaultProps: {
          disabled: true,
        },
        styleOverrides: {
          // Name of the styleSheet
          root: {
            // Name of the rule
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            borderRadius: 3,
            border: 0,
            color: 'white',
            height: 48,
            padding: '0 30px',
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
          },
        },
      },
      MuiAppBar: {
        defaultProps: {
          position: 'fixed',
        },
      },
    },
  });

  <ThemeProvider theme={theme}>
    <Button>Overrides</Button>
  </ThemeProvider>;
}
const theme2 = createTheme({
  palette: {
    primary: {
      main: blue[500],
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disabled: false,
        TouchRippleProps: {
          center: true,
        },
      },
    },
    MuiTable: {
      defaultProps: {
        cellPadding: 12,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});

const t1: string = createTheme().spacing(1);
const t2: string = createTheme().spacing(1, 2);
const t3: string = createTheme().spacing(1, 2, 3);
const t4: string = createTheme().spacing(1, 2, 3, 4);
// @ts-expect-error
const t5 = createTheme().spacing(1, 2, 3, 4, 5);

// Can't use withStyles effectively as a decorator in TypeScript
// due to https://github.com/Microsoft/TypeScript/issues/4881
// @withStyles(styles)
const DecoratedComponent = withStyles(simpleStyles)(
  class extends React.Component<SimpleComponentProps & WithStyles<typeof simpleStyles>> {
    render() {
      const { classes, text } = this.props;
      return <div className={classes.root}>{text}</div>;
    }
  },
);

// no 'classes' property required at element creation time (#8267)
<DecoratedComponent text="foo" />;

// Allow nested pseudo selectors
withStyles((theme) =>
  createStyles({
    guttered: {
      '&:hover': {
        textDecoration: 'none',
      },
    },
    listItem: {
      '&:hover $listItemIcon': {
        visibility: 'inherit',
      },
    },
  }),
);

{
  // allow top level media queries
  // https://github.com/mui-org/material-ui/issues/12277

  // TypeScript thinks `content` is the CSS property not a classname
  const ambiguousStyles = createStyles({
    content: {
      minHeight: '100vh',
    },
    '@media (min-width: 960px)': {
      content: {
        // @ts-expect-error
        display: 'flex',
      },
    },
  });

  const styles = createStyles({
    contentClass: {
      minHeight: '100vh',
    },
    '@media (min-width: 960px)': {
      contentClass: {
        display: 'flex',
      },
    },
  });
}

{
  const styles = (theme: Theme) =>
    createStyles({
      // Styled similar to ListItemText
      root: {
        '&:first-child': {
          paddingLeft: 0,
        },
        flex: '1 1 auto',
        padding: '0 16px',
      },
      inset: {
        '&:first-child': {
          paddingLeft: theme.spacing(7),
        },
      },
      row: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
      },
    });

  interface ListItemContentProps extends WithStyles<typeof styles> {
    children?: React.ReactElement;
    inset?: boolean;
    row?: boolean;
  }

  const ListItemContent = withStyles(styles, { name: 'ui-ListItemContent' })(
    ({ children, classes, inset, row }: ListItemContentProps) => (
      <div className={classes.root} color="text.secondary">
        {children}
      </div>
    ),
  );
}

{
  interface FooProps extends WithStyles<'x' | 'y'> {
    a: number;
    b: boolean;
  }

  const ListItemContent = withStyles({ x: {}, y: {} })((props: FooProps) => <div />);
}

{
  // https://github.com/mui-org/material-ui/issues/11109
  // The real test here is with "strictFunctionTypes": false,
  // but we don't have a way currently to test under varying
  // TypeScript configurations.

  interface ComponentProps extends WithStyles<typeof styles> {
    caption: string;
  }

  const styles = (theme: Theme) =>
    createStyles({
      content: {
        margin: 4,
      },
    });

  const Component = (props: ComponentProps) => {
    return <div className={props.classes.content}>Hello {props.caption}</div>;
  };

  const StyledComponent = withStyles(styles)(Component);

  class App extends React.Component {
    render() {
      return (
        <div className="App">
          <StyledComponent caption="Developer" />
        </div>
      );
    }
  }

  <App />;
}

{
  // https://github.com/mui-org/material-ui/issues/11191
  const styles = (theme: Theme) =>
    createStyles({
      main: {},
    });

  interface Props extends WithStyles<typeof styles> {
    someProp?: string;
  }

  class SomeComponent extends React.PureComponent<Props> {
    render() {
      return <div />;
    }
  }

  const DecoratedSomeComponent = withStyles(styles)(SomeComponent);

  <DecoratedSomeComponent someProp="hello world" />;
}

{
  // https://github.com/mui-org/material-ui/issues/11312
  withStyles(simpleStyles, { name: 'MyComponent', index: 0 })(() => <div />);
}

{
  // https://github.com/mui-org/material-ui/issues/11164
  const style: StyleRulesCallback<Theme, any, any> = (theme) => ({
    text: theme.typography.body2,
  });
}
{
  // can't provide own `classes` type
  interface Props {
    classes: number;
  }

  class Component extends React.Component<Props & WithStyles<typeof simpleStyles>> {}
  // @ts-expect-error
  const StyledComponent = withStyles(simpleStyles)(Component);

  // @ts-expect-error implicit FunctionComponent
  withStyles(simpleStyles)((props: Props) => null);
  // @ts-expect-error
  withStyles(simpleStyles)((props: Props & WithStyles<typeof simpleStyles>) => null);
  // @ts-expect-error
  withStyles(simpleStyles)((props: Props & { children?: React.ReactNode }) => null);
  withStyles(simpleStyles)(
    // @ts-expect-error
    (props: Props & WithStyles<typeof simpleStyles> & { children?: React.ReactNode }) => null,
  );

  // explicit not but with "Property 'children' is missing in type 'ValidationMap<Props>'".
  // which is not helpful
  const StatelessComponent: React.FunctionComponent<Props> = (props) => null;
  const StatelessComponentWithStyles: React.FunctionComponent<
    Props & WithStyles<typeof simpleStyles>
  > = (props) => null;
  // @ts-expect-error
  withStyles(simpleStyles)(StatelessComponent);
  // @ts-expect-error
  withStyles(simpleStyles)(StatelessComponentWithStyles);
}

{
  // https://github.com/mui-org/material-ui/issues/12670
  interface Props {
    nonDefaulted: string;
    defaulted: number;
  }

  class MyButton extends React.Component<Props & WithStyles<typeof styles>> {
    static defaultProps = {
      defaulted: 0,
    };

    render() {
      const { classes, nonDefaulted, defaulted } = this.props;
      return (
        <Button className={classes.btn}>
          {defaulted}, {nonDefaulted}
        </Button>
      );
    }
  }

  const styles = () =>
    createStyles({
      btn: {
        color: 'red',
      },
    });

  const StyledMyButton = withStyles(styles)(MyButton);

  const CorrectUsage = () => <StyledMyButton nonDefaulted="2" />;
  // @ts-expect-error Property 'nonDefaulted' is missing in type '{}'
  const MissingPropUsage = () => <StyledMyButton />;
}

{
  // https://github.com/mui-org/material-ui/pull/15546
  // Update type definition to let CSS properties be functions
  interface TestProps {
    foo: boolean;
  }

  // withStyles accepts properties as functions
  {
    withStyles({
      root: {
        width: (prop: TestProps) => (prop.foo ? 100 : 0),
      },
      root2: (prop2: TestProps) => ({
        width: (prop: TestProps) => (prop.foo && prop2.foo ? 100 : 0),
        margin: 8,
      }),
    });
  }

  // withStyles accepts properties as functions using a callback
  {
    withStyles((theme) => ({
      root: {
        width: (prop: TestProps) => (prop.foo ? 100 : 0),
      },
      root2: (prop2: TestProps) => ({
        width: (prop: TestProps) => (prop.foo && prop2.foo ? 100 : 0),
        height: theme.spacing(1),
      }),
    }));
  }
}

function themeProviderTest() {
  <ThemeProvider theme={{ foo: 1 }}>{null}</ThemeProvider>;
  // @ts-expect-error
  <ThemeProvider<Theme> theme={{ foo: 1 }}>{null}</ThemeProvider>;
  <ThemeProvider<Theme>
    theme={{ components: { MuiAppBar: { defaultProps: { 'aria-atomic': 'true' } } } }}
  >
    {null}
  </ThemeProvider>;
}
