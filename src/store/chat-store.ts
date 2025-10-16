import { create } from 'zustand'
import { DevvAI } from '@devvai/devv-code-backend'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatState {
  messages: Message[]
  isStreaming: boolean
  currentStreamingMessage: string
  addMessage: (role: 'user' | 'assistant', content: string) => void
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
}

const ai = new DevvAI()

// Health-focused system prompt for medical chat
const SYSTEM_PROMPT = {
  role: 'system' as const,
  content: `You are a helpful AI health assistant for the AI Health Analyzer app. Provide informative, supportive responses about health topics while following these guidelines:

1. Always remind users to consult healthcare professionals for medical advice
2. Provide general health information, not specific medical diagnoses
3. Be supportive and understanding about health concerns
4. Respond in the language the user uses (English, Hindi, or Hinglish)
5. Keep responses concise but informative
6. Focus on prevention, lifestyle, and general wellness

Sample responses:
- For "I have headache" → Suggest rest, hydration, and consulting a doctor if persistent
- For "मुझे बुखार है" → Recommend rest, fluids, and medical consultation if fever persists
- For "Diabetes symptoms" → List common symptoms and emphasize professional diagnosis

Remember: You're an assistant, not a replacement for medical professionals.`
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isStreaming: false,
  currentStreamingMessage: '',

  addMessage: (role, content) => {
    const message: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    }
    set(state => ({ messages: [...state.messages, message] }))
  },

  sendMessage: async (content: string) => {
    const { messages, addMessage } = get()
    
    // Add user message
    addMessage('user', content)
    
    // Set streaming state
    set({ isStreaming: true, currentStreamingMessage: '' })
    
    try {
      // Prepare messages for AI with system prompt
      const aiMessages = [
        SYSTEM_PROMPT,
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user' as const, content }
      ]
      
      const stream = await ai.chat.completions.create({
        model: 'default',
        messages: aiMessages,
        stream: true,
        max_tokens: 1000,
        temperature: 0.7
      })
      
      let fullResponse = ''
      for await (const chunk of stream) {
        const deltaContent = chunk.choices[0]?.delta?.content || ''
        if (deltaContent) {
          fullResponse += deltaContent
          set({ currentStreamingMessage: fullResponse })
        }
      }
      
      // Add complete AI message
      addMessage('assistant', fullResponse)
      
    } catch (error) {
      console.error('AI chat error:', error)
      addMessage('assistant', 'I apologize, but I\'m having trouble responding right now. Please try again later or consult a healthcare professional for urgent concerns.')
    } finally {
      set({ isStreaming: false, currentStreamingMessage: '' })
    }
  },

  clearMessages: () => {
    set({ messages: [], currentStreamingMessage: '' })
  }
}))