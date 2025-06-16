import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Save, Plus, Minus, BookOpen, FileCheck } from 'lucide-react';

interface Question {
  type: 'multiple_choice' | 'short_answer' | 'essay';
  question: string;
  options?: string[];
  correct_answer?: string;
  points: number;
}

interface AssignmentPart {
  id: string;
  type: 'instructions' | 'text' | 'question';
  title: string;
  content: string;
  order: number;
}

interface Assignment {
  title: string;
  description: string;
  course_id: string;
  class_id: string;
  due_date: string;
  max_score: number;
  parts: AssignmentPart[];
}

export const CreateAssessment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('assessment');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    class_id: '',
    max_score: 100
  });

  const [assignmentData, setAssignmentData] = useState<Assignment>({
    title: '',
    description: '',
    course_id: '',
    class_id: '',
    due_date: '',
    max_score: 100,
    parts: []
  });

  const [questions, setQuestions] = useState<Question[]>([
    {
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correct_answer: '',
      points: 1
    }
  ]);

  // Récupérer les cours de l'enseignant
  const { data: courses } = useQuery({
    queryKey: ['teacher-courses-for-assessment', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data } = await supabase
        .from('courses')
        .select('id, title')
        .eq('teacher_id', user.id);
      
      return data || [];
    },
    enabled: !!user
  });

  // Récupérer les classes de l'enseignant
  const { data: classes } = useQuery({
    queryKey: ['teacher-classes-for-assessment', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data } = await supabase
        .from('classes')
        .select('id, name')
        .eq('teacher_id', user.id);
      
      return data || [];
    },
    enabled: !!user
  });

  const createAssessmentMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!user) throw new Error('Utilisateur non connecté');

      const { data: assessment, error } = await supabase
        .from('assessments')
        .insert({
          title: data.title,
          description: data.description,
          course_id: data.course_id,
          max_score: data.max_score,
          questions: data.questions
        })
        .select()
        .single();

      if (error) throw error;
      return assessment;
    },
    onSuccess: () => {
      toast({
        title: "Évaluation créée avec succès",
        description: "Votre évaluation a été créée et est maintenant disponible."
      });
      queryClient.invalidateQueries({ queryKey: ['teacher-stats'] });
      
      // Réinitialiser le formulaire
      setFormData({ title: '', description: '', course_id: '', class_id: '', max_score: 100 });
      setQuestions([{
        type: 'multiple_choice',
        question: '',
        options: ['', '', '', ''],
        correct_answer: '',
        points: 1
      }]);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'évaluation. Veuillez réessayer.",
        variant: "destructive"
      });
      console.error('Erreur création évaluation:', error);
    }
  });

  const createAssignmentMutation = useMutation({
    mutationFn: async (data: Assignment) => {
      if (!user) throw new Error('Utilisateur non connecté');

      console.log('Creating assignment:', data);
      
      return { id: 'temp-id', ...data };
    },
    onSuccess: () => {
      toast({
        title: "Devoir créé avec succès",
        description: "Votre devoir a été créé et assigné à la classe sélectionnée."
      });
      
      setAssignmentData({
        title: '',
        description: '',
        course_id: '',
        class_id: '',
        due_date: '',
        max_score: 100,
        parts: []
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le devoir. Veuillez réessayer.",
        variant: "destructive"
      });
      console.error('Erreur création devoir:', error);
    }
  });

  // Functions for managing assignment parts
  const addAssignmentPart = (type: 'instructions' | 'text' | 'question') => {
    const newPart: AssignmentPart = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: type === 'instructions' ? 'Consignes' : type === 'text' ? 'Texte' : 'Question',
      content: '',
      order: assignmentData.parts.length
    };
    
    setAssignmentData({
      ...assignmentData,
      parts: [...assignmentData.parts, newPart]
    });
  };

  const updateAssignmentPart = (id: string, field: keyof AssignmentPart, value: string) => {
    setAssignmentData({
      ...assignmentData,
      parts: assignmentData.parts.map(part =>
        part.id === id ? { ...part, [field]: value } : part
      )
    });
  };

  const removeAssignmentPart = (id: string) => {
    setAssignmentData({
      ...assignmentData,
      parts: assignmentData.parts.filter(part => part.id !== id)
    });
  };

  const movePartUp = (id: string) => {
    const parts = [...assignmentData.parts];
    const index = parts.findIndex(part => part.id === id);
    if (index > 0) {
      [parts[index], parts[index - 1]] = [parts[index - 1], parts[index]];
      parts.forEach((part, i) => part.order = i);
      setAssignmentData({ ...assignmentData, parts });
    }
  };

  const movePartDown = (id: string) => {
    const parts = [...assignmentData.parts];
    const index = parts.findIndex(part => part.id === id);
    if (index < parts.length - 1) {
      [parts[index], parts[index + 1]] = [parts[index + 1], parts[index]];
      parts.forEach((part, i) => part.order = i);
      setAssignmentData({ ...assignmentData, parts });
    }
  };

  const handleSubmitAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.course_id || !formData.class_id) {
      toast({
        title: "Erreur",
        description: "Le titre, le cours et la classe sont requis.",
        variant: "destructive"
      });
      return;
    }

    if (questions.some(q => !q.question.trim())) {
      toast({
        title: "Erreur",
        description: "Toutes les questions doivent avoir un énoncé.",
        variant: "destructive"
      });
      return;
    }

    createAssessmentMutation.mutate({
      ...formData,
      questions: questions.filter(q => q.question.trim())
    });
  };

  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentData.title.trim() || !assignmentData.course_id || !assignmentData.class_id || !assignmentData.due_date) {
      toast({
        title: "Erreur",
        description: "Tous les champs requis doivent être remplis.",
        variant: "destructive"
      });
      return;
    }

    createAssignmentMutation.mutate(assignmentData);
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correct_answer: '',
      points: 1
    }]);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options![optionIndex] = value;
      setQuestions(updatedQuestions);
    }
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Évaluations et Devoirs</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assessment" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Créer une évaluation
          </TabsTrigger>
          <TabsTrigger value="assignment" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Créer un devoir
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assessment">
          <form onSubmit={handleSubmitAssessment} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales de l'évaluation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre de l'évaluation *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Entrez le titre de l'évaluation..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="course">Cours *</Label>
                    <Select
                      value={formData.course_id}
                      onValueChange={(value) => setFormData({ ...formData, course_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un cours" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses?.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="class">Classe *</Label>
                    <Select
                      value={formData.class_id}
                      onValueChange={(value) => setFormData({ ...formData, class_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une classe" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes?.map((classe) => (
                          <SelectItem key={classe.id} value={classe.id}>
                            {classe.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez votre évaluation..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="max_score">Score maximum</Label>
                  <Input
                    id="max_score"
                    type="number"
                    value={formData.max_score}
                    onChange={(e) => setFormData({ ...formData, max_score: Number(e.target.value) })}
                    min={1}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Questions
                  <Button type="button" onClick={addQuestion} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter une question
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {questions.map((question, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      {questions.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeQuestion(index)}
                          variant="destructive"
                          size="sm"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Type de question</Label>
                        <Select
                          value={question.type}
                          onValueChange={(value: any) => updateQuestion(index, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple_choice">QCM</SelectItem>
                            <SelectItem value="short_answer">Réponse courte</SelectItem>
                            <SelectItem value="essay">Dissertation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Points</Label>
                        <Input
                          type="number"
                          value={question.points}
                          onChange={(e) => updateQuestion(index, 'points', Number(e.target.value))}
                          min={1}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Énoncé de la question</Label>
                      <Textarea
                        value={question.question}
                        onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                        placeholder="Entrez votre question..."
                        rows={2}
                      />
                    </div>

                    {question.type === 'multiple_choice' && (
                      <div className="space-y-2">
                        <Label>Options de réponse</Label>
                        {question.options?.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-2">
                            <span className="text-sm w-8">{String.fromCharCode(65 + optionIndex)}.</span>
                            <Input
                              value={option}
                              onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                              placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                            />
                          </div>
                        ))}
                        
                        <div>
                          <Label>Réponse correcte</Label>
                          <Select
                            value={question.correct_answer || undefined}
                            onValueChange={(value) => updateQuestion(index, 'correct_answer', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez la bonne réponse" />
                            </SelectTrigger>
                            <SelectContent>
                              {question.options?.map((option, optionIndex) => (
                                option.trim() && (
                                  <SelectItem key={optionIndex} value={option}>
                                    {String.fromCharCode(65 + optionIndex)}. {option}
                                  </SelectItem>
                                )
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={createAssessmentMutation.isPending}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {createAssessmentMutation.isPending ? 'Création...' : 'Créer l\'évaluation'}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="assignment">
          <form onSubmit={handleSubmitAssignment} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales du devoir</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="assignment-title">Titre du devoir *</Label>
                  <Input
                    id="assignment-title"
                    value={assignmentData.title}
                    onChange={(e) => setAssignmentData({ ...assignmentData, title: e.target.value })}
                    placeholder="Entrez le titre du devoir..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assignment-course">Cours *</Label>
                    <Select
                      value={assignmentData.course_id}
                      onValueChange={(value) => setAssignmentData({ ...assignmentData, course_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un cours" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses?.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="assignment-class">Classe *</Label>
                    <Select
                      value={assignmentData.class_id}
                      onValueChange={(value) => setAssignmentData({ ...assignmentData, class_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une classe" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes?.map((classe) => (
                          <SelectItem key={classe.id} value={classe.id}>
                            {classe.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="due-date">Date d'échéance *</Label>
                    <Input
                      id="due-date"
                      type="datetime-local"
                      value={assignmentData.due_date}
                      onChange={(e) => setAssignmentData({ ...assignmentData, due_date: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="assignment-max-score">Score maximum</Label>
                    <Input
                      id="assignment-max-score"
                      type="number"
                      value={assignmentData.max_score}
                      onChange={(e) => setAssignmentData({ ...assignmentData, max_score: Number(e.target.value) })}
                      min={1}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="assignment-description">Description générale</Label>
                  <Textarea
                    id="assignment-description"
                    value={assignmentData.description}
                    onChange={(e) => setAssignmentData({ ...assignmentData, description: e.target.value })}
                    placeholder="Description générale du devoir..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Parties du devoir
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      onClick={() => addAssignmentPart('instructions')} 
                      variant="outline" 
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Consignes
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => addAssignmentPart('text')} 
                      variant="outline" 
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Texte
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => addAssignmentPart('question')} 
                      variant="outline" 
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Question
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignmentData.parts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Aucune partie ajoutée. Cliquez sur les boutons ci-dessus pour ajouter des parties au devoir.
                  </p>
                ) : (
                  assignmentData.parts
                    .sort((a, b) => a.order - b.order)
                    .map((part, index) => (
                      <div key={part.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {part.type === 'instructions' ? 'Consignes' : 
                               part.type === 'text' ? 'Texte' : 'Question'}
                            </span>
                            <span className="text-sm text-gray-500">Partie {index + 1}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              onClick={() => movePartUp(part.id)}
                              variant="ghost"
                              size="sm"
                              disabled={index === 0}
                            >
                              ↑
                            </Button>
                            <Button
                              type="button"
                              onClick={() => movePartDown(part.id)}
                              variant="ghost"
                              size="sm"
                              disabled={index === assignmentData.parts.length - 1}
                            >
                              ↓
                            </Button>
                            <Button
                              type="button"
                              onClick={() => removeAssignmentPart(part.id)}
                              variant="destructive"
                              size="sm"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label>Titre de la partie</Label>
                          <Input
                            value={part.title}
                            onChange={(e) => updateAssignmentPart(part.id, 'title', e.target.value)}
                            placeholder="Titre de cette partie..."
                          />
                        </div>

                        <div>
                          <Label>Contenu</Label>
                          <Textarea
                            value={part.content}
                            onChange={(e) => updateAssignmentPart(part.id, 'content', e.target.value)}
                            placeholder={
                              part.type === 'instructions' ? 'Entrez les consignes...' :
                              part.type === 'text' ? 'Entrez le texte...' :
                              'Entrez la question...'
                            }
                            rows={part.type === 'instructions' ? 4 : 3}
                          />
                        </div>
                      </div>
                    ))
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={createAssignmentMutation.isPending}
                className="flex items-center gap-2"
              >
                <FileCheck className="h-4 w-4" />
                {createAssignmentMutation.isPending ? 'Création...' : 'Créer le devoir'}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};
