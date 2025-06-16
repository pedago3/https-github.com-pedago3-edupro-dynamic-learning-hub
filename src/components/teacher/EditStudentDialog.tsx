
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface EditStudentDialogProps {
  student: any | null;
  open: boolean;
  onClose: () => void;
  onEdited: () => void;
}

export function EditStudentDialog({ student, open, onClose, onEdited }: EditStudentDialogProps) {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      full_name: student?.full_name || "",
      email: student?.email || "",
      username: student?.username || "",
    },
  });
  const [loading, setLoading] = useState(false);

  // Update form when student changes
  // (react-hook-form doesn't auto-reset on prop change)
  if (
    student &&
    (form.getValues("full_name") !== student.full_name ||
      form.getValues("email") !== student.email ||
      form.getValues("username") !== student.username)
  ) {
    form.reset({
      full_name: student.full_name || "",
      email: student.email || "",
      username: student.username || "",
    });
  }

  const handleSubmit = async (data: any) => {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        email: data.email,
        username: data.username,
      })
      .eq("id", student.id);

    setLoading(false);

    if (error) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier l'étudiant.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Édité",
        description: "Les informations de l'étudiant ont été mises à jour.",
      });
      onEdited();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={open ? onClose : undefined}>
      <DialogContent onOpenAutoFocus={e => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Modifier l’étudiant</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="full_name"
              rules={{ required: "Le nom complet est requis" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nom complet" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              rules={{
                required: "Le pseudo est requis",
                minLength: { value: 3, message: "Au moins 3 caractères" }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pseudo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nom d'utilisateur" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              rules={{
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Format d'email invalide"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} placeholder="Email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-1" />
                    Sauvegarde...
                  </>
                ) : (
                  "Enregistrer"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Annuler
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
