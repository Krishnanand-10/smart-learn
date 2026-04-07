import GenerationForm from '@/components/GenerationForm';

export default function FlashcardPage() {
  return (
    <GenerationForm 
      title="Generate Flashcards"
      subtitle="Utilize active recall immediately. Upload your lecture notes, point to a video, or describe a topic to instantly auto-generate an interactive flashcard set."
      resourceName="Flashcard Deck"
    />
  );
}
