export type RootStackParamList = {
  Welcome: undefined;
  Home: {name: string};
  SignIn: undefined;
  Chat: {groupName: string | undefined, username: string};
};

export type RootTabParamList = {
  MessagesTab:  {name: string};
  CallsTab: undefined;
  ProfileTab: undefined;
};
