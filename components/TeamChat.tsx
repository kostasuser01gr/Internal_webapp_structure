import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Hash, 
  Search,
  MoreVertical,
  Pin,
  Users,
  Settings,
  Plus,
  Phone,
  Video,
  MessageSquare
} from 'lucide-react';
import { TeamUser, TeamMessage, ChatChannel } from '@/components/types';
import { mockTeamUsers, mockChatChannels, mockTeamMessages } from '@/components/lib/mockData';

const CURRENT_USER_ID = 'user-1'; // Logged in user

export function TeamChat() {
  const [selectedChannel, setSelectedChannel] = useState<ChatChannel | null>(mockChatChannels[0] || null);
  const [messages, setMessages] = useState<TeamMessage[]>(selectedChannel ? (mockTeamMessages[selectedChannel.id] || []) : []);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, _setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChannel) {
      setMessages(mockTeamMessages[selectedChannel.id] || []);
    }
  }, [selectedChannel]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedChannel) return;

    const newMessage: TeamMessage = {
      id: `msg-${Date.now()}`,
      channelId: selectedChannel.id,
      senderId: CURRENT_USER_ID,
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getUserById = (userId: string): TeamUser | undefined => {
    return mockTeamUsers.find(u => u.id === userId);
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString('el-GR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatChannelName = (channel: ChatChannel): string => {
    if (channel.type === 'direct') {
      const otherUserId = channel.participants.find(id => id !== CURRENT_USER_ID);
      const otherUser = getUserById(otherUserId || '');
      return otherUser?.name || channel.name;
    }
    return channel.name;
  };

  const getChannelUser = (channel: ChatChannel): TeamUser | null => {
    if (channel.type === 'direct') {
      const otherUserId = channel.participants.find(id => id !== CURRENT_USER_ID);
      return getUserById(otherUserId || '') || null;
    }
    return null;
  };

  const filteredChannels = mockChatChannels.filter(channel => {
    const channelName = formatChannelName(channel).toLowerCase();
    return channelName.includes(searchQuery.toLowerCase());
  });

  const channelChannels = filteredChannels.filter(c => c.type === 'channel');
  const directMessages = filteredChannels.filter(c => c.type === 'direct');

  // Empty state - no channels created yet
  if (mockChatChannels.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)] bg-white rounded-lg border">
        <div className="text-center max-w-md px-6">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl mb-2">Δεν Υπάρχουν Κανάλια</h3>
          <p className="text-muted-foreground mb-6">
            Δημιουργήστε το πρώτο κανάλι ομαδικής συνομιλίας για να ξεκινήσετε την επικοινωνία με την ομάδα σας.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Δημιουργία Καναλιού
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-lg overflow-hidden border">
      {/* Sidebar - Channels List */}
      <div className="w-64 bg-gray-50 border-r flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg">Team Chat</h2>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Αναζήτηση..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </div>

        {/* Channels & DMs */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {/* Channels Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between px-2 py-1 mb-1">
                <span className="text-xs text-gray-600">ΚΑΝΑΛΙΑ</span>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              {channelChannels.length === 0 ? (
                <p className="text-xs text-gray-500 px-2 py-2">Δεν υπάρχουν κανάλια</p>
              ) : (
                channelChannels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-200 transition-colors mb-0.5 ${
                      selectedChannel?.id === channel.id ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <Hash className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm flex-1 text-left truncate">{channel.name}</span>
                    {channel.unreadCount! > 0 && (
                      <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                        {channel.unreadCount}
                      </Badge>
                    )}
                    {channel.isPinned && <Pin className="h-3 w-3 text-gray-500" />}
                  </button>
                ))
              )}
            </div>

            <Separator className="my-2" />

            {/* Direct Messages Section */}
            <div>
              <div className="flex items-center justify-between px-2 py-1 mb-1">
                <span className="text-xs text-gray-600">ΜΗΝΥΜΑΤΑ</span>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              {directMessages.length === 0 ? (
                <p className="text-xs text-gray-500 px-2 py-2">Δεν υπάρχουν μηνύματα</p>
              ) : (
                directMessages.map((channel) => {
                  const user = getChannelUser(channel);
                  return (
                    <button
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-200 transition-colors mb-0.5 ${
                        selectedChannel?.id === channel.id ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {getInitials(formatChannelName(channel))}
                          </AvatarFallback>
                        </Avatar>
                        {user && (
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`} />
                        )}
                      </div>
                      <span className="text-sm flex-1 text-left truncate">{formatChannelName(channel)}</span>
                      {channel.unreadCount! > 0 && (
                        <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                          {channel.unreadCount}
                        </Badge>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Current User */}
        <div className="p-3 border-t bg-white">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor('online')}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">Χρήστης</p>
              <p className="text-xs text-green-600">● Online</p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-14 px-4 border-b flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            {selectedChannel ? (
              selectedChannel.type === 'channel' ? (
                <>
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Hash className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base">{selectedChannel.name}</h3>
                    <p className="text-xs text-gray-600">{selectedChannel.description}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(formatChannelName(selectedChannel))}</AvatarFallback>
                    </Avatar>
                    {getChannelUser(selectedChannel) && (
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(getChannelUser(selectedChannel)!.status)}`} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base">{formatChannelName(selectedChannel)}</h3>
                    {getChannelUser(selectedChannel) && (
                      <p className="text-xs text-gray-600">
                        {getChannelUser(selectedChannel)!.status === 'online' ? 'Ενεργός' : 'Εκτός σύνδεσης'}
                      </p>
                    )}
                  </div>
                </>
              )
            ) : (
              <h3 className="text-base text-gray-500">Επιλέξτε κανάλι</h3>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Users className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Hash className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg mb-2">Καλώς ήρθατε στο {selectedChannel ? formatChannelName(selectedChannel) : ''}!</h3>
              <p className="text-sm text-gray-600 max-w-md">
                {selectedChannel?.type === 'channel' 
                  ? 'Αυτή είναι η αρχή του καναλιού. Στείλτε το πρώτο σας μήνυμα!'
                  : 'Αυτή είναι η αρχή της συνομιλίας σας. Πείτε γεια!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => {
              const sender = getUserById(message.senderId);
              const isCurrentUser = message.senderId === CURRENT_USER_ID;
              const showAvatar = index === 0 || messages[index - 1]?.senderId !== message.senderId;
              const showTimestamp = index === 0 || 
                new Date(message.timestamp).getTime() - new Date(messages[index - 1]?.timestamp || 0).getTime() > 300000; // 5 min

              return (
                <div key={message.id}>
                  {showTimestamp && (
                    <div className="flex items-center justify-center my-4">
                      <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {new Date(message.timestamp).toLocaleDateString('el-GR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  )}
                  <div className={`flex gap-3 group ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                    {showAvatar && !isCurrentUser ? (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="text-xs">
                          {getInitials(sender?.name || 'User')}
                        </AvatarFallback>
                      </Avatar>
                    ) : !isCurrentUser ? (
                      <div className="w-8 flex-shrink-0" />
                    ) : null}
                    
                    <div className={`flex-1 ${isCurrentUser ? 'flex justify-end' : ''}`}>
                      {showAvatar && !isCurrentUser && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">{sender?.name}</span>
                          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                        </div>
                      )}
                      <div className={`inline-block max-w-[70%] ${isCurrentUser ? 'text-right' : ''}`}>
                        <div className={`rounded-lg px-4 py-2 ${
                          isCurrentUser 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {message.reactions.map((reaction, idx) => (
                              <button
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border rounded-full hover:border-blue-500 transition-colors"
                              >
                                <span className="text-sm">{reaction.emoji}</span>
                                <span className="text-xs text-gray-600">{reaction.count}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {message.edited && (
                          <p className="text-xs text-gray-500 mt-1">(επεξεργασμένο)</p>
                        )}
                      </div>
                    </div>

                    {/* Message actions on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-start gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Smile className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">ΜΚ</AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-end gap-2">
            <Button variant="ghost" size="sm" className="flex-shrink-0">
              <Paperclip className="h-5 w-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder={`Μήνυμα σε ${selectedChannel ? formatChannelName(selectedChannel) : ''}`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <strong>Enter</strong> για αποστολή · <strong>Shift + Enter</strong> για νέα γραμμή
          </p>
        </div>
      </div>

      {/* Right Sidebar - Members (Optional) */}
      <div className="w-56 bg-gray-50 border-l hidden xl:flex flex-col">
        <div className="p-4 border-b bg-white">
          <h3 className="text-sm">Μέλη ({selectedChannel?.participants.length || 0})</h3>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {selectedChannel?.participants.map((userId) => {
              const user = getUserById(userId);
              if (!user) return null;
              return (
                <div
                  key={user.id}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 cursor-pointer"
                >
                  <div className="relative">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${getStatusColor(user.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{user.name}</p>
                    <p className="text-xs text-gray-600 capitalize">{user.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
