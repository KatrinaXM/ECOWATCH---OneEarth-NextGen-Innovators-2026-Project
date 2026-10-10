import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@ecowatch_openrouter_key';
export const OPENROUTER_MODEL = 'deepseek/deepseek-chat';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export async function getOpenRouterApiKey(): Promise<string> {
  const envKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY?.trim();
  if (envKey) return envKey;

  const storedKey = await AsyncStorage.getItem(STORAGE_KEY);
  return storedKey?.trim() || '';
}

export async function saveOpenRouterApiKey(key: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, key.trim());
}

export async function clearOpenRouterApiKey(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export function getLocalResearchResponse(userQuery: string): string {
  const queryLower = userQuery.toLowerCase();

  if (queryLower.includes('wbgt') || queryLower.includes('wet bulb') || queryLower.includes('temp')) {
    return (
      '### WBGT vs Ambient Temperature Research\n\n' +
      '**1. What is WBGT?**\n' +
      'Wet Bulb Globe Temperature (WBGT) is a composite index that measures heat stress in direct sunlight. Unlike simple ambient air temperature, WBGT factors in:\n' +
      '• **Natural Wet-Bulb Temp (70%)**: Evaporative cooling capacity based on humidity and air movement.\n' +
      '• **Black Globe Temp (20%)**: Radiant heat from solar radiation and ground reflectivity.\n' +
      '• **Dry-Bulb Ambient Temp (10%)**: Standard ambient air temperature.\n\n' +
      '**2. Risk Thresholds for Students:**\n' +
      '• **< 31.0°C**: Low/Moderate risk — standard hydration breaks.\n' +
      '• **31.0°C – 32.9°C**: High risk (Orange Band) — compulsory rest periods every 15–20 minutes in shade.\n' +
      '• **≥ 33.0°C**: Extreme risk (Red Band) — postpone or move intense outdoor physical training indoors.\n\n' +
      '**3. Scientific Takeaway:**\n' +
      'At 85% relative humidity (typical in tropical Singapore/Jurong), sweat cannot evaporate effectively. WBGT captures this metabolic risk where a standard thermometer only registers air temperature.'
    );
  }

  if (queryLower.includes('jurong') || queryLower.includes('microclimate') || queryLower.includes('singapore') || queryLower.includes('island')) {
    return (
      '### Jurong West & Urban Microclimate Analysis\n\n' +
      '**1. Microclimate Characteristics:**\n' +
      'Jurong West features high-density residential blocks, educational campuses, and adjacent industrial corridors. This causes localized heat retention.\n\n' +
      '**2. Urban Heat Island (UHI) Effect:**\n' +
      '• Concrete and tarmac absorb solar radiation during peak hours (11:00 AM – 3:30 PM).\n' +
      '• Late afternoon re-radiation keeps temperatures 1.5°C–3.0°C higher than coastal green corridors.\n\n' +
      '**3. Recommendations for Students:**\n' +
      '• Use shaded park connectors and covered walkways for campus commutes.\n' +
      '• Plan outdoor training before 9:30 AM or after 5:30 PM.'
    );
  }

  if (queryLower.includes('hydration') || queryLower.includes('heat stress') || queryLower.includes('safety') || queryLower.includes('water')) {
    return (
      '### Hydration & Heat Stress Protocol\n\n' +
      '**1. Pre-Hydration:**\n' +
      'Drink 300–500ml of water 1–2 hours before outdoor activity.\n\n' +
      '**2. During Activity (Moderate to High WBGT):**\n' +
      '• Sip 150–250ml every 15–20 minutes.\n' +
      '• For sessions over 60 minutes, use electrolyte drinks to maintain sodium balance.\n\n' +
      '**3. Heat Illness Stages:**\n' +
      '• **Heat Cramps**: Move to shade, rehydrate, stretch.\n' +
      '• **Heat Exhaustion**: Heavy sweating, dizziness, clammy skin; cool down with wet towels, elevate legs.\n' +
      '• **Heat Stroke**: Confusion, hot dry skin; immediate emergency medical assistance required.'
    );
  }

  if (queryLower.includes('mitigation') || queryLower.includes('climate') || queryLower.includes('carbon') || queryLower.includes('urban')) {
    return (
      '### Urban Climate Mitigation Strategies\n\n' +
      '**1. Tree Canopies:**\n' +
      'Dense native tree canopies lower localized surface ground temperatures by up to 10°C compared to exposed asphalt.\n\n' +
      '**2. Cool Pavements:**\n' +
      'High-albedo reflective coatings minimize heat absorption in school grounds and pathways.\n\n' +
      '**3. Ventilation Corridors:**\n' +
      'Aligning campus open spaces with prevailing monsoon winds enhances convective cooling.'
    );
  }

  return (
    `### EcoWatch Research Report: ${userQuery}\n\n` +
    '**1. Environmental Observations:**\n' +
    `Analyzing current parameters regarding "${userQuery}": tropical climate dynamics depend directly on ambient temperature, relative humidity, and solar radiation flux.\n\n` +
    '**2. Heat Stress Correlation:**\n' +
    '• Elevated relative humidity severely impairs evaporative cooling via perspiration.\n' +
    '• Wet Bulb Globe Temperature (WBGT) is the internationally recognized benchmark for heat injury prevention in schools and sports.\n\n' +
    '**3. Actionable Recommendations:**\n' +
    'Monitor the EcoWatch Home screen telemetry and follow recommended rest-work cycles during elevated heat bands.'
  );
}

export async function sendOpenRouterResearchQuery(
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
  overrideKey?: string
): Promise<string> {
  const apiKey = overrideKey?.trim() || (await getOpenRouterApiKey());

  if (apiKey) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://ecowatch.app',
          'X-Title': 'EcoWatch Student Research',
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            {
              role: 'system',
              content:
                'You are the EcoWatch AI Research Assistant for students. You specialize in environmental science, heat stress index (WBGT), meteorology, climate patterns, and ecological sustainability. Provide insightful, structured, and student-friendly research responses.',
            },
            ...messages,
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) return reply;
      } else {
        const errJson = await response.json().catch(() => null);
        const errMsg = errJson?.error?.message;
        if (response.status === 401) {
          throw new Error('Invalid OpenRouter API Key. Please update your key in settings.');
        } else if (response.status === 402) {
          throw new Error('Insufficient OpenRouter credits on this account.');
        } else if (errMsg) {
          throw new Error(`OpenRouter Error: ${errMsg}`);
        }
      }
    } catch (err: any) {
      if (err?.message?.includes('OpenRouter') || err?.message?.includes('API Key')) {
        throw err;
      }
      // If it's a general network failure, fall through to local engine
    }
  }

  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
  return getLocalResearchResponse(lastUserMsg);
}
