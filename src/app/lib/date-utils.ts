import { Chat } from "../types/MessageTypes";

export type DateGroup = {
  label: string;
  chats: Chat[];
};

/**
 * Groups chat items by date categories (Today, Yesterday, This Week, This Month, Older)
 */
export function groupChatsByDate(chats: Chat[]): DateGroup[] {
  if (!chats || chats.length === 0) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());

  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const result: DateGroup[] = [
    { label: "Today", chats: [] },
    { label: "Yesterday", chats: [] },
    { label: "This Week", chats: [] },
    { label: "This Month", chats: [] },
    { label: "Older", chats: [] },
  ];
  // Sort chats by created_at in descending order (newest first)
  const sortedChats = [...chats].sort((a, b) => {
    const dateA = a.created_At ? new Date(a.created_At).getTime() : 0;
    const dateB = b.created_At ? new Date(b.created_At).getTime() : 0;
    return dateB - dateA;
  });

  sortedChats.forEach((chat) => {
    const chatDate = new Date(chat.created_At || new Date());
    chatDate.setHours(0, 0, 0, 0);

    if (chatDate.getTime() === today.getTime()) {
      result[0].chats.push(chat);
    } else if (chatDate.getTime() === yesterday.getTime()) {
      result[1].chats.push(chat);
    } else if (chatDate >= thisWeekStart && chatDate < yesterday) {
      result[2].chats.push(chat);
    } else if (chatDate >= thisMonthStart && chatDate < thisWeekStart) {
      result[3].chats.push(chat);
    } else {
      result[4].chats.push(chat);
    }
  });

  // Filter out empty groups
  console.log("Grouped Chats:", result);
  return result.filter((group) => group.chats.length > 0);
}
