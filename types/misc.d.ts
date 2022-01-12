declare module '*/config.json' {
  interface ConfigData {
    userId: string;
    apiKey: string;
		from: {
			email: string;
			name: string;
		},
		to: string;
  }

  const value: ConfigData;
  export = value;
}