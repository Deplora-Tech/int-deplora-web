import { Card, CardContent } from "../components/ui/card";

export function ConversationChat() {
  return (
    <Card className="border-zinc-800 bg-black/50 backdrop-blur-xl">
      <CardContent className="p-6">
        <h3 className="mb-4 text-lg font-medium text-white">
          Conversation Chat
        </h3>
        <p className="text-zinc-400">
          This is a general conversation chat. No deployment plan has been
          generated yet.
        </p>
      </CardContent>
    </Card>
  );
}
