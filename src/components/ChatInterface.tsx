import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChatStore } from '@/store/chat-store'
import { useAuthStore } from '@/store/auth-store'
import { Send, Bot, User, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ChatInterface() {
  const [inputValue, setInputValue] = useState('')
  const { messages, isStreaming, currentStreamingMessage, sendMessage } = useChatStore()
  const { isAuthenticated } = useAuthStore()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentStreamingMessage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isStreaming) return
    
    const message = inputValue.trim()
    setInputValue('')
    await sendMessage(message)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="medical-card p-6 text-center">
        <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-2">AI Health Chat</h3>
        <p className="text-muted-foreground mb-4">
          Sign in to chat with our AI health assistant for instant answers to your health questions.
        </p>
      </div>
    )
  }

  return (
    <div className="medical-card flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">AI Health Assistant</h3>
          <p className="text-sm text-muted-foreground">
            Ask me about symptoms, conditions, or general health
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                <p className="text-sm">
                  Hello! I'm your AI health assistant. I can help answer questions about symptoms, 
                  conditions, and general wellness. Remember, I provide information only - always 
                  consult healthcare professionals for medical advice.
                </p>
              </div>
            </div>
          )}

          {/* Chat messages */}
          {messages.map((message) => (
            <div key={message.id} className={cn(
              "flex gap-3",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}>
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className={cn(
                "rounded-lg p-3 max-w-[80%]",
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              )}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 block mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}

          {/* Streaming message */}
          {isStreaming && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                <p className="text-sm whitespace-pre-wrap">
                  {currentStreamingMessage}
                  <span className="animate-pulse">▋</span>
                </p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about symptoms, conditions, or health tips..."
            disabled={isStreaming}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!inputValue.trim() || isStreaming}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Supports English, Hindi, and Hinglish • Always consult professionals for medical advice
        </p>
      </form>
    </div>
  )
}