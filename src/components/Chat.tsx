import Image from "next/image"
import { useState } from "react"

// Чат
export function ChatPole() {
  const [isOpen, setIsOpen] = useState(false);
  const chatSize = isOpen ? "20rem" : "2.8rem";

  return (
      <div className="bg-black/70 transition-all duration-300 flex items-center justify-center fixed right-0 top-15" 
      style={{borderTopLeftRadius: "0.625rem", borderBottomLeftRadius: "0.625rem", width: chatSize, height: chatSize}}>
          {isOpen ? (
              <>
              <button
                  type="button"
                  className="absolute left-3 top-3 cursor-pointer"
                  onClick={() => setIsOpen(false)}>
                  <Image src="/vercel.svg" alt="Close" width={20} height={20} className="rotate-180 rounded-[10%]"/>
              </button>
              </>
          ) : (
              <button
                  type="button"
                  className="absolute  cursor-pointer left-[0.3rem]"
                  onClick={() => setIsOpen(true)}>
                  <Image src="/svgs/chat.svg" alt="Chat" width={42} height={42}/>
              </button>
          )}
      </div>
  );
}