
import React, { useState } from "react";
import { LessonWidget } from "./LessonWidget";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export const LessonWidgetDemo = () => {
  const [openPlan, setOpenPlan] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const { toast } = useToast();

  return (
    <div className="py-8 flex flex-col items-center gap-6">
      <LessonWidget
        onOpenPlan={() => setOpenPlan(true)}
        onShowVideo={() => setOpenVideo(true)}
        onLaunchExercise={() =>
          toast({
            title: "Exercice lancé !",
            description: "L'exercice interactif s'affiche ici (fonction à implémenter selon votre besoin).",
          })
        }
      />

      <Dialog open={openPlan} onOpenChange={setOpenPlan}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Plan de la leçon</DialogTitle>
            <DialogDescription>
              <div className="p-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Introduction et objectifs</li>
                  <li>Développement du concept</li>
                  <li>Exemple pratique</li>
                  <li>Questions/réponses</li>
                  <li>Conclusion</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={openVideo} onOpenChange={setOpenVideo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vidéo de la leçon</DialogTitle>
            <DialogDescription>
              {/* Remplacez l'URL par celle de votre vidéo */}
              <div className="aspect-video w-full">
                <iframe
                  className="rounded"
                  src="https://www.youtube.com/embed/w7ejDZ8SWv8"
                  title="Vidéo pédagogique"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
