import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, XCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";

export function MeetingOverlay() {
  const user = useAuth((s) => s.user);
  const [activeMeetings, setActiveMeetings] = useState<any[]>([]);
  const [currentMeeting, setCurrentMeeting] = useState<any | null>(null);

  useEffect(() => {
    if (!user) return;

    const checkMeetings = async () => {
      try {
        const { data } = await api.get("/api/meetings/my");
        setActiveMeetings(data);
      } catch (err) {
        console.error("Failed to fetch meetings");
      }
    };

    checkMeetings();
    const interval = setInterval(checkMeetings, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [user]);

  if (!user || activeMeetings.length === 0) return null;

  const meeting = activeMeetings[0];
  const jitsiLink = meeting.meetingLink || `https://meet.jit.si/Simba_${meeting.id}`;

  return (
    <>
      <AnimatePresence>
        {!currentMeeting && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-96 z-[100]"
          >
            <div className="bg-primary text-primary-foreground p-6 rounded-[2.5rem] shadow-2xl flex items-center gap-4 border-4 border-white/20 backdrop-blur-xl">
              <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center animate-pulse">
                <Video className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-lg leading-tight">{meeting.title || "Active Company Meeting"}</h3>
                <p className="text-white/80 text-sm font-medium">Started by {meeting.creator?.name || "Unknown"}</p>
                <div className="mt-3 flex gap-2">
                  <Button 
                    className="rounded-xl bg-white text-primary hover:bg-white/90 font-bold h-10 px-6"
                    onClick={() => { window.open(jitsiLink, '_blank'); setCurrentMeeting(null); }}
                  >
                    Join Now
                  </Button>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full text-white/50 hover:text-white" onClick={() => setActiveMeetings([])}>
                 <X className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentMeeting && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setCurrentMeeting(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video rounded-[3rem] bg-card border-4 border-primary shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex-1 bg-neutral-900 relative">
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
                    <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mb-6 border-2 border-primary/50">
                       <Video className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-black mb-2">{meeting.title}</h2>
                    <p className="text-white/60 font-medium mb-8">Meeting ready — click below to join the video call</p>
                    <div className="flex gap-4">
                      <Button
                        className="rounded-2xl h-14 px-8 bg-green-600 hover:bg-green-700 text-white font-bold gap-3 text-base shadow-lg"
                        onClick={() => { window.open(jitsiLink, '_blank'); setCurrentMeeting(null); }}
                      >
                        <Video className="h-5 w-5" /> Open Meeting Room
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-2xl h-14 px-8 gap-2 border-white/20 text-white hover:bg-white/10"
                        onClick={() => { navigator.clipboard.writeText(jitsiLink); toast.success("Meeting link copied!"); }}
                      >
                        <XCircle className="h-5 w-5" /> Copy Link
                      </Button>
                    </div>
                 </div>
              </div>
              <div className="h-24 bg-card border-t border-border flex items-center justify-center gap-4 px-8">
                 <Button variant="outline" size="icon" className="rounded-full h-12 w-12 hover:bg-red-500 hover:text-white transition-colors" onClick={() => setCurrentMeeting(null)}>
                    <XCircle className="h-6 w-6" />
                 </Button>
                 <div className="h-8 w-px bg-border mx-2" />
                 <Button className="rounded-2xl h-12 px-8 bg-red-500 hover:bg-red-600 text-white font-bold" onClick={() => setCurrentMeeting(null)}>
                    Dismiss
                 </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
