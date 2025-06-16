
import React, { useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { useTeacherNotifications } from "@/hooks/useTeacherNotifications";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale/fr";

export const TeacherNotificationsBell: React.FC = () => {
  const { notifications, unreadCount, loading, markAsRead, clearAllNotifications } = useTeacherNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="relative p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
        onClick={() => setOpen((o) => !o)}
        aria-label="Voir les notifications"
      >
        <Bell className="h-6 w-6 text-indigo-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 rounded-full text-xs px-1.5 py-0.5 text-white font-bold animate-pingOnce">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-96 max-w-xs sm:max-w-md bg-white border border-slate-200 shadow-2xl rounded-xl z-40">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-slate-800">Notifications</span>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-rose-600 hover:bg-rose-100"
                  title="Effacer toutes les notifications"
                  onClick={() => {
                    clearAllNotifications();
                  }}
                >
                  <Trash2 className="h-5 w-5" />
                  <span className="sr-only">Effacer toutes les notifications</span>
                </Button>
              )}
              <button
                className="text-sm text-indigo-600 hover:underline ml-1"
                onClick={() => setOpen(false)}
              >
                Fermer
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-auto">
            {loading ? (
              <div className="p-6 text-slate-600 text-center">Chargement...</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-slate-400 text-center">Aucune notification</div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className={`p-4 flex gap-3 items-start ${!notif.read ? "bg-indigo-50/40" : ""}`}
                  >
                    <div>
                      <span className={`inline-block mb-1 px-2 py-0.5 rounded text-xs font-medium
                        ${
                          notif.type_validation === "leçon"
                            ? "bg-blue-100 text-blue-700"
                            : notif.type_validation === "cours"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-violet-100 text-violet-700"
                        }
                      `}>
                        {notif.type_validation.charAt(0).toUpperCase() + notif.type_validation.slice(1)}
                      </span>
                      <div>
                        {notif.payload && notif.payload["élève"] && (
                          <span className="font-bold">{notif.payload["élève"]}</span>
                        )}{" "}
                        a validé {notif.type_validation === "leçon"
                          ? "une leçon"
                          : notif.type_validation === "cours"
                          ? "un cours"
                          : `une ${notif.type_validation}`}
                        {notif.payload && notif.payload["cours"] && (
                          <> : <span className="font-semibold">{notif.payload["cours"]}</span></>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {formatDistanceToNow(new Date(notif.date_validation), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </div>
                    </div>
                    <div className="ml-auto flex flex-col items-end">
                      {!notif.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-xs text-emerald-700 hover:bg-emerald-100"
                          onClick={() => markAsRead(notif.id)}
                          title="Marquer comme lu"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

