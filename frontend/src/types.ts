export type RootStackParamList = {
  Welcome: undefined;
  Home: {name: string};
  SignIn: undefined;
  Chat: {groupName: string , username: string | undefined, background: string , emoji: string  };
};

export type RootTabParamList = {
  MessagesTab:  {name: string};
  CallsTab: undefined;
  ProfileTab: undefined;
};
