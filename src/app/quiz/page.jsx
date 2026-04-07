import GenerationForm from '@/components/GenerationForm';

export default function QuizPage() {
  return (
    <GenerationForm 
      title="Generate a Quiz"
      subtitle="Generate a quiz strictly contextually accurate to the material by uploading a file, pasting a link, or securely defining your own subject parameters."
      resourceName="Quiz"
    />
  );
}
