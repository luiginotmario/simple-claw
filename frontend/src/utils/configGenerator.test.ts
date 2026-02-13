import { describe, it, expect } from 'vitest';
import { generateConfig } from './configGenerator';

describe('generateConfig', () => {
  it('should generate a valid config with name and skills', () => {
    const input = {
      userName: 'Mario',
      skills: ['Calendar', 'Uber']
    };

    const configStr = generateConfig(input);
    const config = JSON.parse(configStr);

    expect(config.schema).toBe('1.0');
    expect(config.agent.name).toBe('Mario');
    expect(config.skills).toHaveProperty('calendar');
    expect(config.skills.calendar.enabled).toBe(true);
    expect(config.skills).toHaveProperty('uber');
    expect(config.skills.uber.enabled).toBe(true);
    expect(config.skills).not.toHaveProperty('resy');
  });

  it('should handle empty skills', () => {
    const input = {
      userName: 'Luigi',
      skills: []
    };

    const configStr = generateConfig(input);
    const config = JSON.parse(configStr);

    expect(config.agent.name).toBe('Luigi');
    expect(config.skills).toEqual({});
  });
});
