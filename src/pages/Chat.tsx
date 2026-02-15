import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import {
  ArrowLeft, Send, Loader2, MessageSquare, Ban, AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  id: string;
  application_id: string;
  company_user_id: string;
  candidate_user_id: string;
  is_active: boolean;
  candidate_opted_out: boolean;
  created_at: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("id");
  const { toast } = useToast();

  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherName, setOtherName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/login"); return; }
      setUserId(user.id);
      await loadConversations(user.id);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (conversationId && userId) {
      openConversation(conversationId);
    }
  }, [conversationId, userId]);

  // Realtime messages
  useEffect(() => {
    if (!activeConversation) return;

    const channel = supabase
      .channel(`chat-${activeConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeConversation.id}`,
        },
        (payload) => {
          const msg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          // Mark as read if from other person
          if (msg.sender_id !== userId) {
            supabase.from("messages").update({ is_read: true }).eq("id", msg.id);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeConversation, userId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async (uid: string) => {
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .or(`company_user_id.eq.${uid},candidate_user_id.eq.${uid}`)
      .order("updated_at", { ascending: false });

    if (data) {
      // Load other party names
      const enriched = await Promise.all(
        data.map(async (conv: any) => {
          const otherId = conv.company_user_id === uid
            ? conv.candidate_user_id
            : conv.company_user_id;
          const { data: profile } = await supabase
            .from("profiles")
            .select("name")
            .eq("user_id", otherId)
            .maybeSingle();
          return { ...conv, otherName: profile?.name || "Usuário" };
        })
      );
      setConversations(enriched);
    }
  };

  const openConversation = async (convId: string) => {
    const { data: conv } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", convId)
      .maybeSingle();

    if (!conv) return;
    setActiveConversation(conv as Conversation);

    const otherId = (conv as any).company_user_id === userId
      ? (conv as any).candidate_user_id
      : (conv as any).company_user_id;
    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("user_id", otherId)
      .maybeSingle();
    setOtherName(profile?.name || "Usuário");

    // Load messages
    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });
    setMessages((msgs as Message[]) || []);

    // Mark unread as read
    if (msgs) {
      const unread = msgs.filter((m: any) => !m.is_read && m.sender_id !== userId);
      for (const m of unread) {
        await supabase.from("messages").update({ is_read: true }).eq("id", m.id);
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || !userId) return;
    setSending(true);

    const { error } = await supabase.from("messages").insert({
      conversation_id: activeConversation.id,
      sender_id: userId,
      content: newMessage.trim(),
    });

    if (error) {
      toast({ title: "Erro ao enviar mensagem", variant: "destructive" });
    } else {
      setNewMessage("");
      // Update conversation timestamp
      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", activeConversation.id);
    }
    setSending(false);
  };

  const optOut = async () => {
    if (!activeConversation) return;
    await supabase
      .from("conversations")
      .update({ candidate_opted_out: true })
      .eq("id", activeConversation.id);
    setActiveConversation({ ...activeConversation, candidate_opted_out: true });
    toast({ title: "Chat desativado", description: "Você optou por não usar o chat nesta conversa." });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 pt-20 pb-4 flex gap-4 max-h-screen">
        {/* Conversations list */}
        <div className={`${activeConversation ? "hidden md:flex" : "flex"} flex-col w-full md:w-80 border border-border rounded-xl bg-card overflow-hidden`}>
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Conversas
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8 px-4">
                Nenhuma conversa ainda
              </p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    navigate(`/chat?id=${conv.id}`);
                    openConversation(conv.id);
                  }}
                  className={`w-full text-left px-4 py-3 border-b border-border hover:bg-muted/50 transition-colors ${
                    activeConversation?.id === conv.id ? "bg-accent/30" : ""
                  }`}
                >
                  <p className="font-semibold text-foreground text-sm truncate">
                    {conv.otherName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {conv.candidate_opted_out ? "Chat desativado" : formatDistanceToNow(new Date(conv.updated_at || conv.created_at), { addSuffix: true, locale: ptBR })}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className={`${!activeConversation ? "hidden md:flex" : "flex"} flex-1 flex-col border border-border rounded-xl bg-card overflow-hidden`}>
          {activeConversation ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => {
                      setActiveConversation(null);
                      navigate("/chat");
                    }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div>
                    <p className="font-bold text-foreground">{otherName}</p>
                    {activeConversation.candidate_opted_out && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <Ban className="w-3 h-3" /> Chat desativado pelo candidato
                      </p>
                    )}
                  </div>
                </div>
                {/* Opt-out button for candidates */}
                {userId === activeConversation.candidate_user_id && !activeConversation.candidate_opted_out && (
                  <Button variant="outline" size="sm" onClick={optOut} className="text-destructive gap-1">
                    <Ban className="w-4 h-4" /> Desativar chat
                  </Button>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {activeConversation.candidate_opted_out && (
                  <div className="flex items-center gap-2 justify-center text-muted-foreground text-sm py-4">
                    <AlertCircle className="w-4 h-4" />
                    O candidato optou por não utilizar o chat
                  </div>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                        msg.sender_id === userId
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.sender_id === userId ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                        {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              {!activeConversation.candidate_opted_out && (
                <div className="px-4 py-3 border-t border-border">
                  <form
                    onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                    className="flex gap-2"
                  >
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="flex-1"
                      maxLength={1000}
                    />
                    <Button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="bg-gradient-hero text-primary-foreground"
                    >
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Selecione uma conversa</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
