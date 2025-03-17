import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { CheckCircle } from "lucide-react";
import { Message } from "../types/MessageTypes";
interface SecureInputFormProps {
  messageData: Message;
}

export function SecureInputForm({ messageData }: SecureInputFormProps) {
  const [formData, setFormData] = useState<{ [key: string]: string | boolean }>(
    {
      message: messageData.content || "",
      secure: messageData.type === "secure",
      ...messageData.fields?.reduce(
        (acc, field) => ({ ...acc, [field]: "" }),
        {}
      ),
    }
  );

  useEffect(() => {
    if (messageData.fields) {
      const initialFields = messageData.fields.reduce(
        (acc: { [key: string]: string }, field) => {
          acc[field] = "";
          return acc;
        },
        {}
      );
      setFormData((prev) => ({ ...prev, ...initialFields }));
    }
  }, [messageData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Card className="max-w-md w-full mx-auto bg-[#0a0d14]/90 border border-[#1e2a3a] shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-8 text-transparent bg-gradient-to-r from-[#00f5d4] via-[#00c4f5] to-[#00a6f9] bg-clip-text">
          {messageData.content}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#8b9cb3] mb-2">
              Message
            </label>
            <Input
              type="text"
              name="message"
              value={
                typeof formData.message === "string" ? formData.message : ""
              }
              onChange={handleChange}
              placeholder="Enter your message"
              required
              className="bg-[#0c1015] border-[#1e2a3a] text-gray-100 placeholder:text-gray-600 focus:border-[#00f5d4] focus:ring-[#00f5d4]/10 shadow-inner shadow-black/20"
            />
          </div>

          <div className="flex items-center space-x-3 bg-[#0c1015]/50 p-3 rounded-lg border border-[#1e2a3a]/50">
            <div className="flex items-center justify-center w-6 h-6">
              <CheckCircle className="w-5 h-5 text-[#00f5d4]" />
            </div>
            <label className="text-sm font-medium text-[#8b9cb3]">
              Secure Message
            </label>
          </div>

          {formData.secure &&
            messageData.fields?.map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-[#8b9cb3] mb-2">
                  {field.replace(/_/g, " ").toUpperCase()}
                </label>
                <Input
                  type="text"
                  name={field}
                  value={
                    typeof formData[field] === "string" ? formData[field] : ""
                  }
                  onChange={handleChange}
                  placeholder={`Enter ${field.replace(/_/g, " ")}`}
                  required
                  className="bg-[#0c1015] border-[#1e2a3a] text-gray-100 placeholder:text-gray-600 focus:border-[#00f5d4] focus:ring-[#00f5d4]/10 shadow-inner shadow-black/20"
                />
              </div>
            ))}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#00f5d4] via-[#00c4f5] to-[#00a6f9] hover:from-[#00dfc0] hover:via-[#00b3e1] hover:to-[#0095e2] text-black font-semibold py-2.5 px-4 rounded-md transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/20"
          >
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
