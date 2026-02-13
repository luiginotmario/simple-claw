export interface ConfigInput {
  userName: string;
  skills: string[]; // e.g., ['calendar', 'uber', 'resy']
}

export function generateConfig(input: ConfigInput): string {
  const { userName, skills } = input;
  
  const config = {
    schema: "1.0",
    agent: {
      name: userName || "Assistant",
      persona: `A helpful assistant for ${userName}.`,
      voice: "default"
    },
    skills: skills.reduce((acc, skill) => {
      acc[skill.toLowerCase()] = { enabled: true };
      return acc;
    }, {} as Record<string, { enabled: boolean }>)
  };

  return JSON.stringify(config, null, 2);
}
