
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FormData } from '@/types/annualProgramming';
import { AnnualProgrammingHeader } from './AnnualProgrammingHeader';
import { CourseInformationSection } from './CourseInformationSection';
import { PedagogicalObjectivesSection } from './PedagogicalObjectivesSection';
import { CalendarDatesSection } from './CalendarDatesSection';
import { TrimestersSection } from './TrimestersSection';
import { TeachingMethodsSection } from './TeachingMethodsSection';
import { EvaluationSection } from './EvaluationSection';
import { DifferentiationSection } from './DifferentiationSection';
import { PartnershipsSection } from './PartnershipsSection';
import { NotesSection } from './NotesSection';
import { FormActionsSection } from './FormActionsSection';

export const AnnualProgrammingForm = () => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    etablissement: '',
    enseignant: '',
    anneeScolaire: '2025-2026',
    matiere: '',
    niveau: '',
    specialite: '',
    heuresParSemaine: 0,
    competences: '',
    objectifs: '',
    rentree: '',
    vacancesToussaint: { debut: '', fin: '' },
    vacancesNoel: { debut: '', fin: '' },
    vacancesHiver: { debut: '', fin: '' },
    vacancesPrintemps: { debut: '', fin: '' },
    bacBlanc: '',
    epreuvesFinales: '',
    grandOral: '',
    finAnnee: '',
    trimestre1: { chapitres: '', activites: '', evaluations: '' },
    trimestre2: { chapitres: '', activites: '', evaluations: '' },
    trimestre3: { chapitres: '', activites: '', evaluations: '' },
    approches: [],
    outils: [],
    ressources: '',
    controlsEcrits: 0,
    devoirsMaison: 0,
    evaluationsOrales: 0,
    projets: 0,
    participation: 0,
    criteresEvaluation: '',
    elevesDifficulte: '',
    elevesHautPotentiel: '',
    besoinsPep: '',
    interdisciplinarite: '',
    partenariats: '',
    sorties: '',
    indicateursReussite: '',
    ajustements: '',
    notesPersonnelles: ''
  });

  // Sauvegarde automatique dans localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('programmationAnnuelle');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error('Erreur lors du chargement des données sauvegardées:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('programmationAnnuelle', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...((prev as any)[parent] || {}),
        [field]: value
      }
    }));
  };

  const handleCheckboxChange = (field: 'approches' | 'outils', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleSave = () => {
    toast({
      title: "Programmation sauvegardée",
      description: "Votre programmation annuelle a été sauvegardée localement.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <AnnualProgrammingHeader 
        formData={formData} 
        onInputChange={handleInputChange} 
      />

      <CourseInformationSection 
        formData={formData} 
        onInputChange={handleInputChange} 
      />

      <PedagogicalObjectivesSection 
        formData={formData} 
        onInputChange={handleInputChange} 
      />

      <CalendarDatesSection 
        formData={formData} 
        onInputChange={handleInputChange} 
        onNestedInputChange={handleNestedInputChange}
      />

      <TrimestersSection 
        formData={formData} 
        onNestedInputChange={handleNestedInputChange}
      />

      <TeachingMethodsSection 
        formData={formData} 
        onCheckboxChange={handleCheckboxChange}
        onInputChange={handleInputChange}
      />

      <EvaluationSection 
        formData={formData} 
        onInputChange={handleInputChange}
      />

      <DifferentiationSection 
        formData={formData} 
        onInputChange={handleInputChange}
      />

      <PartnershipsSection 
        formData={formData} 
        onInputChange={handleInputChange}
      />

      <NotesSection 
        formData={formData} 
        onInputChange={handleInputChange}
      />

      <FormActionsSection 
        onSave={handleSave} 
        onPrint={handlePrint} 
      />
    </div>
  );
};
