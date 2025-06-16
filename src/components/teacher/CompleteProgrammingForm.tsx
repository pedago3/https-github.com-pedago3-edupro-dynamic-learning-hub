import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  FileText, 
  Calendar, 
  Lightbulb
} from 'lucide-react';

// Import the new smaller components
import { GeneralInformationSection } from './programming/GeneralInformationSection';
import { PedagogicalObjectivesSection } from './PedagogicalObjectivesSection';
import { TrimestersSection } from './TrimestersSection';
import { WeeklyScheduleSection } from './programming/WeeklyScheduleSection';
import { EvaluationsSection } from './programming/EvaluationsSection';
import { ResourcesSection } from './programming/ResourcesSection';
import { ProjectsActivitiesSection } from './programming/ProjectsActivitiesSection';
import { DifferentiationSection } from './DifferentiationSection';
import { AssessmentSection } from './programming/AssessmentSection';

interface CompleteProgrammingData {
  // Informations générales
  matiere: string;
  niveau: string;
  enseignant: string;
  horaire: string;
  effectif: string;
  manuel: string;
  
  // Objectifs pédagogiques
  competences: string;
  savoirs: string;
  objectifsTransversaux: string;
  
  // Trimestres
  trimestre1Chapitres: string;
  trimestre1Evaluations: string;
  trimestre1Projets: string;
  trimestre2Chapitres: string;
  trimestre2Evaluations: string;
  trimestre2Projets: string;
  trimestre3Chapitres: string;
  trimestre3Evaluations: string;
  trimestre3Projets: string;
  
  // Calendrier détaillé (échantillon)
  semaines: Array<{
    numero: string;
    dates: string;
    contenu: string;
    activites: string;
    evaluations: string;
  }>;
  
  // Évaluations
  evaluationsFormatives: Array<{ type: string; date: string }>;
  evaluationsSommatives: Array<{ type: string; date: string }>;
  coefficientsBareme: string;
  
  // Ressources
  manuelsDocuments: string;
  outilsNumeriques: string;
  materielSpecialise: string;
  
  // Projets pédagogiques
  sortiesPedagogiques: Array<{ lieu: string; date: string }>;
  interventionsExterieures: Array<{ intervenant: string; date: string }>;
  projetsTransversaux: string;
  
  // Différenciation
  elevesDifficulte: string;
  elevesAvances: string;
  besoinsPareiculiers: string;
  
  // Bilan
  evaluationTrimestre1: string;
  evaluationTrimestre2: string;
  evaluationTrimestre3: string;
  ameliorationsAnneesuivante: string;
}

export const CompleteProgrammingForm = () => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<CompleteProgrammingData>({
    matiere: '',
    niveau: '',
    enseignant: '',
    horaire: '',
    effectif: '',
    manuel: '',
    competences: '',
    savoirs: '',
    objectifsTransversaux: '',
    trimestre1Chapitres: '',
    trimestre1Evaluations: '',
    trimestre1Projets: '',
    trimestre2Chapitres: '',
    trimestre2Evaluations: '',
    trimestre2Projets: '',
    trimestre3Chapitres: '',
    trimestre3Evaluations: '',
    trimestre3Projets: '',
    semaines: [
      { numero: 'S1', dates: '04-08 sept', contenu: 'Introduction + Chapitre 1', activites: 'TP, exercices...', evaluations: 'Évaluation diagnostique' },
      { numero: 'S2', dates: '11-15 sept', contenu: 'Chapitre 1 (suite)', activites: 'Travaux pratiques', evaluations: 'Quiz' },
      { numero: 'S3', dates: '', contenu: '', activites: '', evaluations: '' },
      { numero: 'S4', dates: '', contenu: '', activites: '', evaluations: '' }
    ],
    evaluationsFormatives: [
      { type: '', date: '' },
      { type: 'Quiz chapitre 1', date: 'S3' },
      { type: 'TP noté', date: 'S5' }
    ],
    evaluationsSommatives: [
      { type: 'DS 1', date: 'S6' },
      { type: 'DS 2', date: 'S12' },
      { type: 'Bac Blanc', date: 'S28' }
    ],
    coefficientsBareme: '',
    manuelsDocuments: '',
    outilsNumeriques: '',
    materielSpecialise: '',
    sortiesPedagogiques: [
      { lieu: '', date: '' },
      { lieu: 'Musée/Laboratoire/Entreprise', date: 'S15' }
    ],
    interventionsExterieures: [
      { intervenant: '', date: '' },
      { intervenant: 'Conférencier spécialisé', date: 'S20' }
    ],
    projetsTransversaux: '',
    elevesDifficulte: '',
    elevesAvances: '',
    besoinsPareiculiers: '',
    evaluationTrimestre1: '',
    evaluationTrimestre2: '',
    evaluationTrimestre3: '',
    ameliorationsAnneesuivante: ''
  });

  // Sauvegarde automatique dans localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('programmationComplette');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error('Erreur lors du chargement des données sauvegardées:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('programmationComplette', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (arrayName: string, index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: (prev[arrayName as keyof CompleteProgrammingData] as any[]).map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof CompleteProgrammingData] as any),
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    toast({
      title: "Programmation sauvegardée",
      description: "Votre programmation annuelle complète a été sauvegardée localement.",
    });
  };

  const handleSaveAsPDF = () => {
    window.print();
    toast({
      title: "Génération PDF",
      description: "La boîte de dialogue d'impression s'est ouverte. Sélectionnez 'Enregistrer au format PDF'.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* En-tête */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <Calendar className="h-8 w-8" />
            PROGRAMMATION ANNUELLE
          </CardTitle>
          <h2 className="text-2xl font-semibold">Année Scolaire 2024-2025</h2>
          <div className="mt-4 bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700 italic">Modèle à personnaliser selon votre matière et votre niveau d'enseignement</p>
          </div>
        </CardHeader>
      </Card>

      {/* Informations Générales */}
      <GeneralInformationSection
        formData={{
          matiere: formData.matiere,
          niveau: formData.niveau,
          enseignant: formData.enseignant,
          horaire: formData.horaire,
          effectif: formData.effectif,
          manuel: formData.manuel
        }}
        onInputChange={handleInputChange}
      />

      {/* Objectifs Pédagogiques */}
      <PedagogicalObjectivesSection
        formData={{
          competences: formData.competences,
          objectifs: formData.savoirs
        }}
        onInputChange={handleInputChange}
      />

      {/* Planification Trimestrielle */}
      <TrimestersSection
        formData={{
          trimestre1: {
            chapitres: formData.trimestre1Chapitres,
            activites: formData.trimestre1Evaluations,
            evaluations: formData.trimestre1Projets
          },
          trimestre2: {
            chapitres: formData.trimestre2Chapitres,
            activites: formData.trimestre2Evaluations,
            evaluations: formData.trimestre2Projets
          },
          trimestre3: {
            chapitres: formData.trimestre3Chapitres,
            activites: formData.trimestre3Evaluations,
            evaluations: formData.trimestre3Projets
          }
        }}
        onNestedInputChange={(trimestre, field, value) => {
          const fieldMap: { [key: string]: string } = {
            'trimestre1-chapitres': 'trimestre1Chapitres',
            'trimestre1-activites': 'trimestre1Evaluations',
            'trimestre1-evaluations': 'trimestre1Projets',
            'trimestre2-chapitres': 'trimestre2Chapitres',
            'trimestre2-activites': 'trimestre2Evaluations',
            'trimestre2-evaluations': 'trimestre2Projets',
            'trimestre3-chapitres': 'trimestre3Chapitres',
            'trimestre3-activites': 'trimestre3Evaluations',
            'trimestre3-evaluations': 'trimestre3Projets',
          };
          const mappedField = fieldMap[`${trimestre}-${field}`];
          if (mappedField) {
            handleInputChange(mappedField, value);
          }
        }}
      />

      {/* Calendrier Détaillé */}
      <WeeklyScheduleSection
        semaines={formData.semaines}
        onArrayChange={handleArrayChange}
      />

      {/* Évaluations */}
      <EvaluationsSection
        evaluationsFormatives={formData.evaluationsFormatives}
        evaluationsSommatives={formData.evaluationsSommatives}
        coefficientsBareme={formData.coefficientsBareme}
        onArrayChange={handleArrayChange}
        onInputChange={handleInputChange}
      />

      {/* Ressources */}
      <ResourcesSection
        manuelsDocuments={formData.manuelsDocuments}
        outilsNumeriques={formData.outilsNumeriques}
        materielSpecialise={formData.materielSpecialise}
        onInputChange={handleInputChange}
      />

      {/* Projets et Activités */}
      <ProjectsActivitiesSection
        sortiesPedagogiques={formData.sortiesPedagogiques}
        interventionsExterieures={formData.interventionsExterieures}
        projetsTransversaux={formData.projetsTransversaux}
        onArrayChange={handleArrayChange}
        onInputChange={handleInputChange}
      />

      {/* Différenciation */}
      <DifferentiationSection
        formData={{
          elevesDifficulte: formData.elevesDifficulte,
          elevesHautPotentiel: formData.elevesAvances,
          besoinsPep: formData.besoinsPareiculiers
        }}
        onInputChange={handleInputChange}
      />

      {/* Bilan et Évaluation */}
      <AssessmentSection
        evaluationTrimestre1={formData.evaluationTrimestre1}
        evaluationTrimestre2={formData.evaluationTrimestre2}
        evaluationTrimestre3={formData.evaluationTrimestre3}
        ameliorationsAnneesuivante={formData.ameliorationsAnneesuivante}
        onInputChange={handleInputChange}
      />

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Sauvegarder
        </Button>
        <Button onClick={handleSaveAsPDF} variant="outline" className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50">
          <FileText className="h-4 w-4" />
          Sauvegarder sous forme PDF
        </Button>
      </div>

      {/* Pied de page */}
      <Card className="bg-blue-50">
        <CardContent className="p-4 text-center text-gray-600">
          <p className="text-sm flex items-center justify-center gap-2">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <strong>Conseil :</strong> Cette programmation est un document évolutif. N'hésitez pas à l'ajuster tout au long de l'année selon les besoins de vos élèves et les contraintes rencontrées.
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Modèle de programmation annuelle - Personnalisable selon vos besoins pédagogiques
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
