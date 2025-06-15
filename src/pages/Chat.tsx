import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ChatInterface from '@/components/chat/ChatInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChatSession, ChatMessage } from '@/types';
import { MessageSquare, Plus, Clock, AlertTriangle, FileText } from 'lucide-react';

// --- Define example conversations ---
const now = new Date();
const demoSessions: ChatSession[] = [
  {
    id: 'conv1',
    title: 'Investigating an Alert',
    workspaceId: 'ws-demo',
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: '1',
        content: "Hey AI, I just got a SIEM alert for a suspicious PowerShell script detected on host WIN-1234. Can you summarize possible MITRE ATT&CK techniques related to this behavior?",
        role: "user",
        timestamp: new Date(now.getTime() - 800000),
      },
      {
        id: '2',
        content:
          "Sure. Suspicious PowerShell activity commonly relates to:\n\nT1059.001 (PowerShell) — Execution of PowerShell commands for defense evasion or execution.\n\nT1086 (PowerShell - Deprecated) — Legacy technique still referenced in some alerts.\n\nT1027 (Obfuscated Files or Information) — Scripts may be obfuscated to bypass detection.\nWould you like to see recent incidents in your environment involving these techniques?",
        role: "assistant",
        timestamp: new Date(now.getTime() - 790000),
      },
      {
        id: '3',
        content: "Yes, show me incidents in the last 7 days with this behavior.",
        role: "user",
        timestamp: new Date(now.getTime() - 780000),
      },
      {
        id: '4',
        content:
          "3 incidents match:\n\nTicket #457: Lateral movement attempt via PSExec.\n\nTicket #462: Suspicious Base64-encoded PowerShell payload.\n\nTicket #468: Possible C2 beacon via PowerShell Empire framework.\nWould you like to review any of these in detail or escalate this current alert?",
        role: "assistant",
        timestamp: new Date(now.getTime() - 770000),
      }
    ],
  },
  {
    id: 'conv2',
    title: 'IOC Enrichment',
    workspaceId: 'ws-demo',
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: '1',
        content: "Can you check if the IP 198.51.100.23 is known in any threat intel feeds we have access to?",
        role: "user",
        timestamp: new Date(now.getTime() - 700000),
      },
      {
        id: '2',
        content:
          "198.51.100.23 is listed in the following sources:\n\nAlienVault OTX: Malicious C2 server flagged last week.\n\nVirusTotal: 15 detections out of 70 engines, marked as C2 beacon.\n\nInternal Case: Linked to Ticket #452 from 3 days ago (Ransomware pre-encryption activity).\nWould you like to open a ticket or block this IP on perimeter firewalls?",
        role: "assistant",
        timestamp: new Date(now.getTime() - 690000),
      }
    ],
  },
  {
    id: 'conv3',
    title: 'Ticket Mgmt Guidance',
    workspaceId: 'ws-demo',
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: '1',
        content: "I want to escalate Ticket #472 to critical — what criteria should be documented according to our playbook?",
        role: "user",
        timestamp: new Date(now.getTime() - 600000),
      },
      {
        id: '2',
        content:
          "According to the SOC escalation playbook v4.3, escalation to critical requires:\n\nConfirmed data exfiltration or lateral movement.\n\nActive attacker presence in the environment.\n\nImpact on critical business systems.\n\nIncident Commander notification.\nYou have documented #2 and #3. Would you like me to pre-fill an escalation form for you?",
        role: "assistant",
        timestamp: new Date(now.getTime() - 590000),
      }
    ],
  },
  {
    id: 'conv4',
    title: 'Pre-Shift Brief Request',
    workspaceId: 'ws-demo',
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: '1',
        content: "Summarize for me the critical open incidents I need to prioritize in this shift.",
        role: "user",
        timestamp: new Date(now.getTime() - 500000),
      },
      {
        id: '2',
        content:
          "As of the last 12 hours:\n\nTicket #485: Ransomware pre-encryption indicators detected on HR File Server.\n\nTicket #479: Suspicious credential dump attempt blocked on Domain Controller DC-01.\n\nTicket #490: Open investigation into possible phishing campaign — 5 users reported suspicious emails.\nSuggested Priority: Investigate Ticket #485 immediately due to potential encryption risk.\nWould you like the full shift summary emailed or exported as PDF?",
        role: "assistant",
        timestamp: new Date(now.getTime() - 490000),
      }
    ],
  },
  {
    id: 'conv5',
    title: 'Playbook Retrieval',
    workspaceId: 'ws-demo',
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: '1',
        content: "How do I handle lateral movement alerts according to our latest procedures?",
        role: "user",
        timestamp: new Date(now.getTime() - 400000),
      },
      {
        id: '2',
        content:
          "Per Playbook ‘Lateral Movement Detection v3.2’:\n\nIsolate affected host from network.\n\nCollect volatile memory (use Velociraptor script X).\n\nExtract user login events and SMB traffic logs for the last 24 hours.\n\nAnalyze for Pass-the-Hash or Remote Service Creation attempts.\nI can provide direct links to the scripts and logging queries — want them now?",
        role: "assistant",
        timestamp: new Date(now.getTime() - 390000),
      }
    ],
  },
  {
    id: 'conv6',
    title: 'IOC Summary for Reporting',
    workspaceId: 'ws-demo',
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: '1',
        content: "List all newly detected IoCs from this week.",
        role: "user",
        timestamp: new Date(now.getTime() - 300000),
      },
      {
        id: '2',
        content:
          "This week’s newly observed IoCs:\n\nIPs: 198.51.100.23, 203.0.113.45\n\nDomains: badguydomain.net, update-server.xyz\n\nFile Hashes (SHA256): 8f5e…78b9.exe (marked as AgentTesla), c3d2…e4f1.dll (unknown RAT)\nDo you want to generate an IOC report in CSV or PDF format?",
        role: "assistant",
        timestamp: new Date(now.getTime() - 290000),
      }
    ],
  },
  {
    id: 'conv7',
    title: 'Emergency SOP Chat',
    workspaceId: 'ws-demo',
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: '1',
        content: "An alert says ‘Multiple Failed RDP Logins’ from 5 different countries — what should I do first?",
        role: "user",
        timestamp: new Date(now.getTime() - 200000),
      },
      {
        id: '2',
        content:
          "Suggested Immediate Actions (per SOP RDP Brute v2.1):\n\nTemporarily block external RDP on firewall.\n\nForce password reset for affected accounts.\n\nReview login logs for signs of successful unauthorized access.\n\nAlert Incident Commander if unauthorized access confirmed.\nShall I create a ticket and populate the checklist for you?",
        role: "assistant",
        timestamp: new Date(now.getTime() - 190000),
      }
    ],
  },
];

const dummyAIResponses = [
  "Here's a summary according to available threat knowledge.",
  "I've found some matching IOCs for you.",
  "Would you like to create a ticket for this?",
  "Let me know if you need escalation support.",
  "Further details are available in the playbook.",
  "I recommend reviewing the alert context for next steps.",
  "Check recent incidents in your dashboard.",
  "Let me know if you want a report exported.",
  "Ready for your next question.",
];

const Chat = () => {
  // Clone the sessions statefully so each can have independent dynamic messages
  const [sessions, setSessions] = useState<ChatSession[]>(
    demoSessions.map((session) => ({ ...session }))
  );
  const [activeChatId, setActiveChatId] = useState(sessions[0].id);

  // Find current active session
  const activeChatIdx = sessions.findIndex((chat) => chat.id === activeChatId);
  const activeChat = sessions[activeChatIdx];

  const [isComposing, setIsComposing] = useState(false);

  // New chat creation
  const handleNewChat = () => {
    const now = new Date();
    const newSession: ChatSession = {
      id: `new-${Date.now()}`,
      title: 'New AI Session',
      messages: [],
      workspaceId: 'ws-demo',
      createdAt: now,
      updatedAt: now,
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveChatId(newSession.id);
  };

  // Updated send message to support fallback if session not found
  const handleSendMessage = (content: string, vtResult?: string) => {
    // vtResult for VirusTotal result so we can inject it just after user message
    const idx = sessions.findIndex(s => s.id === activeChatId);
    const targetChat = sessions[idx];
    if (!targetChat) return;

    const now = new Date();
    const userMsg: ChatMessage = {
      id: `${targetChat.messages.length + 1}`,
      content,
      role: "user",
      timestamp: now,
    };
    let msgs = [...targetChat.messages, userMsg];

    if (vtResult) {
      const vtMsg: ChatMessage = {
        id: `${msgs.length + 1}`,
        content: vtResult,
        role: "assistant",
        timestamp: new Date(),
      };
      msgs = [...msgs, vtMsg];
    }

    const updatedChat: ChatSession = {
      ...targetChat,
      messages: msgs,
      updatedAt: now,
    };
    setSessions((prev) =>
      prev.map((chat, i) => (i === idx ? updatedChat : chat))
    );

    // Only run dummy AI response if not VirusTotal
    if (!vtResult) {
      setIsComposing(true);
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: `${updatedChat.messages.length + 1}`,
          content: dummyAIResponses[Math.floor(Math.random() * dummyAIResponses.length)],
          role: 'assistant',
          timestamp: new Date(),
        };
        const nextUpdatedChat: ChatSession = {
          ...updatedChat,
          messages: [...updatedChat.messages, aiMsg],
          updatedAt: new Date(),
        };
        setSessions((prev) =>
          prev.map((chat, i) => (i === idx ? nextUpdatedChat : chat))
        );
        setIsComposing(false);
      }, 1400);
    }
  };

  const handleEscalate = () => {
    // Demo escalation button; optional
    alert('Escalate action would be triggered here (demo only).');
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-120px)] flex gap-6">
        {/* Chat Sessions Sidebar */}
        <div className="w-80 space-y-4">
          <Card className="bg-cyber-darker border-cyber-gunmetal">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-cyber-red" />
                  Ask AI Sessions
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-cyber-red text-cyber-red px-2 py-1"
                  onClick={handleNewChat}
                  aria-label="Start new chat"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">New chat</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* One scrollable area for all sessions */}
              <div className="max-h-80 overflow-y-auto flex flex-col gap-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => setActiveChatId(session.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      session.id === activeChatId
                        ? 'bg-cyber-red text-white'
                        : 'bg-cyber-gunmetal/50 text-gray-300 hover:bg-cyber-gunmetal'
                    }`}
                  >
                    <div className="font-medium truncate">{session.title}</div>
                    <div className="text-xs flex items-center mt-1 opacity-75">
                      <Clock className="h-3 w-3 mr-1" />
                      {session.updatedAt.toLocaleTimeString()}
                    </div>
                    {(session.title.includes('Emergency') || session.title.includes('Incident')) && (
                      <Badge variant="outline" className="mt-2 text-xs border-cyber-red text-cyber-red">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Escalation
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Context Panel */}
          <Card className="bg-cyber-darker border-cyber-gunmetal">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="h-5 w-5 mr-2 text-cyber-red" />
                Context Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Demo: RAG Knowledge</span>
                  <Badge className="bg-cyber-red text-white">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Threat Intel Feeds</span>
                  <Badge className="bg-green-500 text-white">Live</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">MITRE ATT&CK</span>
                  <Badge className="bg-blue-500 text-white">v13.1</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">SOC Playbooks</span>
                  <Badge className="bg-purple-500 text-white">Current</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Interface */}
        <div className="flex-1">
          <ChatInterface
            session={activeChat}
            onSendMessage={handleSendMessage}
            onEscalate={handleEscalate}
            isComposing={isComposing}
            className="h-full"
            enableFileUpload
          />
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
