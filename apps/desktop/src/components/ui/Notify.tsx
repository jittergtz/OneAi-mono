import { TextEffect } from "../../../components/motion-primitives/text-effect";
import { TextScramble } from "../../../components/motion-primitives/text-scramble";

export function NotifySearch({ searchState }: { searchState: boolean }) {
  return (
    <TextEffect per='char' className="text-white/80 text-sm" preset='fade'>
  {searchState ? "Search mode enabled" : "Search mode disabled"}
  </TextEffect>
  );
}

export function NotifyReason() {
    return (
      <TextScramble className=' text-white/70 text-xs '>
        Reason is enabled
      </TextScramble>
    );
  }
  


 