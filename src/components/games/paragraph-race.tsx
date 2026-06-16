import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TypingEngine } from "@/components/typing/typing-engine";
import { Zap } from "lucide-react";

const PASSAGES = [
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump. The five boxing wizards jump quickly. Sphinx of black quartz, judge my vow.",
  "India is the seventh largest country in the world by area and the most populous democracy. It has a diverse culture, multiple languages, and a rich history spanning thousands of years. The country has made remarkable progress in science, technology, space research, and information technology.",
  "Typing is a fundamental skill in the modern world. With computers and digital devices everywhere, the ability to type quickly and accurately is more important than ever. Regular practice using proper finger placement on the home row keys will significantly improve your typing speed and reduce errors.",
  "The Supreme Court of India is the highest judicial forum and final court of appeal under the Constitution of India. It consists of the Chief Justice of India and a maximum of thirty-three other judges. The court has wide original, appellate, and advisory jurisdiction over all matters of law.",
  "Speed typing requires proper technique and consistent practice. The correct posture involves sitting straight with your feet flat on the floor. Your wrists should be slightly elevated above the keyboard. Each finger is responsible for specific keys and should return to the home row after each keystroke.",
  "Government examinations in India test candidates on their typing speed and accuracy. The SSC, Railway, and various state government exams require minimum typing speeds of thirty to forty words per minute in English and twenty-five words per minute in Hindi. Regular practice is essential to clear these tests.",
  "The Indian Constitution is the supreme law of India. It was adopted by the Constituent Assembly on the twenty-sixth of November nineteen forty-nine and became effective on the twenty-sixth of January nineteen fifty. It is the longest written constitution of any sovereign country in the world.",
];

interface Props { onEnd: (wpm: number, accuracy: number) => void; }

export function ParagraphRaceGame({ onEnd }: Props) {
  const [started, setStarted] = useState(false);
  const [passage] = useState(() => PASSAGES[Math.floor(Math.random() * PASSAGES.length)]);
  const [currentPassage, setCurrentPassage] = useState(passage);

  function handleFinish(wpm: number, accuracy: number) {
    onEnd(wpm, accuracy);
  }

  if (!started) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">📄</div>
        <h2 className="text-2xl font-bold mb-2">Paragraph Race</h2>
        <p className="text-muted-foreground mb-6">Type the full paragraph as fast and accurately as possible. Your WPM and accuracy will be recorded.</p>
        <div className="bg-muted/30 rounded-xl p-4 mb-6 text-left text-sm font-mono leading-relaxed max-w-md mx-auto text-muted-foreground">
          {currentPassage}
        </div>
        <div className="flex justify-center gap-2">
          <Button size="lg" onClick={() => setStarted(true)} className="gold-gradient text-[hsl(222_47%_11%)] font-bold">
            <Zap className="w-4 h-4 mr-2" />Start Typing
          </Button>
          <Button variant="outline" onClick={() => setCurrentPassage(PASSAGES[Math.floor(Math.random() * PASSAGES.length)])}>New Passage</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TypingEngine
        text={currentPassage}
        onFinish={handleFinish}
        onStart={() => {}}
        showTimer
        title="Paragraph Race"
      />
    </div>
  );
}
