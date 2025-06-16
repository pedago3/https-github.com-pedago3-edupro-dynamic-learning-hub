
import React from "react";
import { Button } from "@/components/ui/button";

interface LessonWidgetProps {
  onOpenPlan: () => void;
  onShowVideo: () => void;
  onLaunchExercise: () => void;
}

export const LessonWidget: React.FC<LessonWidgetProps> = ({
  onOpenPlan,
  onShowVideo,
  onLaunchExercise,
}) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-md mx-auto space-y-4">
      <h3 className="font-bold text-lg mb-2">Votre leçon du jour</h3>
      <div className="flex flex-col space-y-3">
        <Button onClick={onOpenPlan}>Ouvrir le plan</Button>
        <Button onClick={onShowVideo} variant="secondary">
          Afficher la vidéo
        </Button>
        <Button onClick={onLaunchExercise} variant="outline">
          Lancer l'exercice
        </Button>
      </div>
    </div>
  );
};
