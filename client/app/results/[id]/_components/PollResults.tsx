// "use client";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { getPollById } from "@/lib/actions";
// import { Links, PollAndLinks, PollWithOptions } from "@/lib/helpers.ts/getPollAndAnswers";
// import { Check, Copy } from "lucide-react";
// import { useEffect, useState } from "react";
// import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
// import { io } from "socket.io-client";

// export default function PollResults({ pollAndLinks }: { pollAndLinks: PollAndLinks }) {
//   const [poll, setPoll] = useState<PollWithOptions>(pollAndLinks.poll);
//   const [links] = useState<Links>(pollAndLinks.links);
//   const [copiedVote, setCopiedVote] = useState(false);
//   const [copiedResults, setCopiedResults] = useState(false);

//   async function refreshPoll() {
//     try {
//       const data = await getPollById(poll.id);

//       setPoll(data.poll);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   let timer: NodeJS.Timeout | undefined = undefined;

//   const initSocket = async () => {
//     const socket = io(`${process.env.NEXT_PUBLIC_WS_SERVER_BASE_URL}/?pollId=${poll.id}`);

//     socket.on("newvote", () => {
//       clearTimeout(timer);

//       timer = setTimeout(() => {
//         refreshPoll();
//       }, 1000);
//     });
//   };

//   useEffect(() => {
//     initSocket();

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // whenever copied is set to true, set it back to false after a delay
//   useEffect(() => {
//     if (copiedVote) {
//       const timeout = setTimeout(() => {
//         setCopiedVote(false);
//       }, 1500);

//       return () => clearTimeout(timeout);
//     }

//     if (copiedResults) {
//       const timeout = setTimeout(() => {
//         setCopiedResults(false);
//       }, 1500);

//       return () => clearTimeout(timeout);
//     }
//   }, [copiedVote, copiedResults]);

//   return (
//     <Card className="mt-8">
//       <CardHeader>
//         <h2 className="text-2xl font-bold">{poll?.question}</h2>
//       </CardHeader>
//       <CardContent>
//         <div className="grid lg:grid-cols-12 md:grid-cols-8 grid-cols-4 gap-4 my-4">
//           {poll?.options.map(({ text, votes }, index) => (
//             <Card className="col-span-4" key={`option${index}`}>
//               <CardHeader>
//                 <CardTitle>{text}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p>{votes} votes</p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         <ResponsiveContainer height={400} className="mt-16">
//           <BarChart data={poll.options} maxBarSize={122}>
//             <XAxis dataKey="text" tick={{ fill: "rgb(3, 7, 17)" }} stroke="rgb(3, 7, 17)" />
//             <YAxis tick={{ fill: "rgb(3, 7, 17)" }} stroke="rgb(3, 7, 17)" />
//             <defs>
//               <linearGradient id="colorUv" x1="0" y1="0" x2="100%" y2="0" spreadMethod="reflect">
//                 <stop offset="0" stopColor="#6d28d9" stopOpacity={1} />
//                 <stop offset="100%" stopColor="#a855f7" stopOpacity={1} />
//               </linearGradient>
//             </defs>
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="votes" fill="url(#colorUv)" radius={[8, 8, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </CardContent>
//       <CardFooter>
//         {/* // TODO this is ugly, make a better component for copying URLs */}
//         <div className="grid lg:grid-cols-12  grid-cols-6 gap-4 mt-16 w-full">
//           <div className="col-span-6">
//             <Button
//               className="w-full"
//               variant="secondary"
//               onClick={() => {
//                 navigator.clipboard.writeText(links.voteUrl);

//                 setCopiedVote(true);
//               }}>
//               {copiedVote ? (
//                 <>
//                   Copied!
//                   <Check className="ml-2 h-4 w-4" />
//                 </>
//               ) : (
//                 <>
//                   Copy voting link
//                   <Copy className="ml-2 h-4 w-4" />
//                 </>
//               )}
//             </Button>
//           </div>
//           <div className="col-span-6">
//             <Button
//               className="w-full"
//               variant="secondary"
//               onClick={() => {
//                 navigator.clipboard.writeText(links.resultsUrl);
//                 setCopiedResults(true);
//               }}>
//               {copiedResults ? (
//                 <>
//                   Copied!
//                   <Check className="ml-2 h-4 w-4" />
//                 </>
//               ) : (
//                 <>
//                   Copy results link
//                   <Copy className="ml-2 h-4 w-4" />
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }
