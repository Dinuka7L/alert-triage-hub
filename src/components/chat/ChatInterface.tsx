import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage, ChatSession } from '@/types';
import { Send, Bot, User, FileText, AlertTriangle, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import AIComposingBubble from './AIComposingBubble';
import FileUploadButton from './FileUploadButton';
import { getInputType, isIp, isUrl, isHash } from '@/lib/inputTypeUtils';
import { fetchVirusTotalDemo } from '@/lib/virusTotalDemo';

interface ChatInterfaceProps {
  session: ChatSession;
  onSendMessage: (content: string, vtResult?: string) => void;
  onEscalate?: () => void;
  className?: string;
  isComposing?: boolean;
  enableFileUpload?: boolean;
}

const ChatInterface = ({
  session,
  onSendMessage,
  onEscalate,
  className,
  isComposing,
  enableFileUpload,
}: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages, isComposing]);

  const checkInputFormatting = (value: string) => {
    if (!value.trim()) {
      setInputError(null);
      return;
    }
    // Accept normal text, ip, url, hash
    if (
      isIp(value) ||
      isUrl(value) ||
      isHash(value) ||
      value.trim().length > 8 // allow questions
    ) {
      setInputError(null);
    } else {
      setInputError(
        'Please enter a plain question, URL (https://...), an IP (1.1.1.1), or a hash (MD5/SHA1/SHA256).'
      );
    }
  };

  useEffect(() => {
    checkInputFormatting(input);
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || inputError) return;
    // If VirusTotal demo input type, simulate VT call first:
    const type = getInputType(input.trim());
    if (type !== 'unknown') {
      // Query VirusTotal demo & format a threat intel-like answer
      const vtData = await fetchVirusTotalDemo(input.trim(), type as "ip" | "url" | "hash");
      const vtResult = [
        `\u26A0\uFE0F VirusTotal Scan Result (${type.toUpperCase()}):`,
        `Verdict: **${vtData.verdict}**`,
        Object.entries(vtData.details).map(([k, v]) => {
          if (typeof v === 'object') {
            return `${k}: ${JSON.stringify(v)}`;
          }
          return `${k}: ${v}`;
        }).join('\n'),
      ].join('\n');
      onSendMessage(input, vtResult);
      setInput('');
      return;
    }
    // Otherwise, send as normal AI chat
    onSendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // File upload handler
  const handleFileSelected = async (file: File) => {
    setIsUploading(true);
    // Demo fake hash for VirusTotal (real-life: hashing or upload needed)
    // We'll "pretend" the file's hash = MD5(last 32 chars in filename)
    const hash =
      file.name.length >= 32
        ? file.name.slice(-32).replace(/[^a-fA-F0-9]/g, 'a')
        : file.name.padStart(32, 'a').slice(0, 32);

    const vtData = await fetchVirusTotalDemo(hash, "hash");
    const vtResult = [
      `\u26A0\uFE0F VirusTotal Scan Result (File: ${file.name}):`,
      `Verdict: **${vtData.verdict}**`,
      Object.entries(vtData.details).map(([k, v]) => {
        if (typeof v === 'object') {
          return `${k}: ${JSON.stringify(v)}`;
        }
        return `${k}: ${v}`;
      }).join('\n'),
    ].join('\n');
    onSendMessage(`(File uploaded) ${file.name}`, vtResult);
    setIsUploading(false);
  };

  return (
    <Card className={cn("bg-cyber-darker border-cyber-gunmetal h-full flex flex-col", className)}>
      <CardHeader className="border-b border-cyber-gunmetal flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Bot className="h-5 w-5 mr-2 text-cyber-red" />
            {session.title}
          </CardTitle>
          <div className="flex space-x-2">
            {onEscalate && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onEscalate}
                className="border-cyber-red text-cyber-red hover:bg-cyber-red hover:text-white"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Escalate
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 space-y-4">
            {session.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3 border border-cyber-gunmetal shadow-md",
                    "backdrop-blur-lg bg-white/10 bg-gradient-to-br from-black/60 via-cyber-darker/70 to-cyber-red/30",
                    message.role === 'user'
                      ? "ml-10 text-white border-cyber-red"
                      : "mr-10 text-gray-100 border-cyber-gunmetal"
                  )}
                  style={{
                    background:
                      message.role === 'user'
                        ? "linear-gradient(135deg, rgba(30,30,30,0.7) 60%, rgba(198,40,40,0.25) 100%)"
                        : "linear-gradient(135deg, rgba(18,18,18,0.82) 70%, rgba(198,40,40,0.10) 100%)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: message.role === 'user'
                      ? "1.5px solid #c62828"
                      : "1px solid #424242",
                  }}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === 'assistant' ? (
                      <Bot className="h-4 w-4 mt-1 text-cyber-red" />
                    ) : (
                      <User className="h-4 w-4 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.citations && message.citations.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-gray-400">Sources:</p>
                          {message.citations.map((doc) => (
                            <Badge
                              key={doc.id}
                              variant="outline"
                              className="text-xs border-gray-500 text-gray-300"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              {doc.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* "AI is composing..." bubble, if composing */}
            {isComposing && <AIComposingBubble />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="border-t border-cyber-gunmetal p-4 flex-shrink-0 flex flex-col gap-2">
          {inputError && (
            <div className="mb-1 text-xs text-cyber-red">
              {inputError}
            </div>
          )}
          <div className="flex space-x-2">
            {enableFileUpload && (
              <FileUploadButton onFileSelected={handleFileSelected} />
            )}
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about threats, upload a file, enter IOCs, URLs, IPs, or get incident guidance..."
              className="bg-cyber-darker border-cyber-gunmetal text-white placeholder-gray-400"
              disabled={isUploading}
            />
            <Button 
              onClick={handleSend}
              disabled={!input.trim() || !!inputError || isComposing || isUploading}
              className="bg-cyber-red hover:bg-cyber-red-dark text-white"
              aria-label="Send"
            >
              {isUploading ? (
                <UploadCloud className="h-4 w-4 animate-bounce" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          {enableFileUpload && (
            <div className="text-xs text-gray-400 mt-1">
              Supported: URLs, IPs, file hashes, or upload a file for demo VirusTotal scan.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
