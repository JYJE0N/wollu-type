import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TypingSettings } from '@/types';

interface SettingsState extends TypingSettings {
  // Additional settings
  theme: string;
  soundEnabled: boolean;
  keyPressSound: boolean;
  completionSound: boolean;
  visualFeedback: boolean;
  showKeyboard: boolean;
  showLiveStats: boolean;
  autoAdvance: boolean;
  focusMode: boolean;
  
  // Actions
  updateSettings: (settings: Partial<SettingsState>) => void;
  resetToDefaults: () => void;
  exportSettings: () => string;
  importSettings: (settings: string) => boolean;
}

const defaultSettings: Omit<SettingsState, 'updateSettings' | 'resetToDefaults' | 'exportSettings' | 'importSettings'> = {
  // Basic typing settings
  wordCount: 5,
  sentenceCount: 3,
  sentenceLength: 'medium',
  sentenceStyle: 'normal',
  
  // Advanced settings
  ghostMode: false,
  typingEffect: true,
  countdown: true,
  
  // Additional settings
  theme: 'default',
  soundEnabled: false,
  keyPressSound: false,
  completionSound: true,
  visualFeedback: true,
  showKeyboard: false,
  showLiveStats: true,
  autoAdvance: false,
  focusMode: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,

      updateSettings: (newSettings: Partial<SettingsState>) => {
        set(state => ({ ...state, ...newSettings }));
      },

      resetToDefaults: () => {
        set(defaultSettings);
      },

      exportSettings: () => {
        const currentSettings = get();
        const exportData = {
          ...currentSettings,
          // Remove functions from export
          updateSettings: undefined,
          resetToDefaults: undefined,
          exportSettings: undefined,
          importSettings: undefined,
        };
        return JSON.stringify(exportData, null, 2);
      },

      importSettings: (settingsJson: string) => {
        try {
          const importedSettings = JSON.parse(settingsJson);
          // Validate imported settings
          const validKeys = Object.keys(defaultSettings);
          const filteredSettings: any = {};
          
          for (const key of validKeys) {
            if (importedSettings.hasOwnProperty(key)) {
              filteredSettings[key] = importedSettings[key];
            }
          }
          
          set(state => ({ ...state, ...filteredSettings }));
          return true;
        } catch (error) {
          console.error('Failed to import settings:', error);
          return false;
        }
      },
    }),
    {
      name: 'wollu-settings-storage',
      version: 1,
    }
  )
);