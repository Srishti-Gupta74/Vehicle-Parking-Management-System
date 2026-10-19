import React, { useState } from 'react';
import {
  GraduationCap,
  Play,
  Terminal,
  Code2,
  RefreshCw,
  BookOpen,
  CheckCircle,
} from 'lucide-react';
import { api } from '../services/api';

const DEMOS = [
  {
    id: 'argument-passing',
    title: 'Argument Passing',
    subtitle: 'Java is strictly Pass-by-Value (Primitives vs References)',
    file: 'com.parking.management.demo.ArgumentPassingDemo',
    vivaQuestion: 'Is Java pass-by-reference or pass-by-value?',
    vivaAnswer:
      'Java is strictly Pass-by-Value at all times. When passing primitives, a copy of the value is passed. When passing object references, a copy of the reference address is passed by value. Reassigning the reference does NOT affect the caller, but mutating the object properties through the copied reference DOES affect the caller.',
  },
  {
    id: 'recursion',
    title: 'Recursion',
    subtitle: 'Recursive 2D Grid Search (findAvailableSlotRecursively)',
    file: 'com.parking.management.demo.RecursionDemo',
    vivaQuestion: 'Where and how is recursion implemented in your project?',
    vivaAnswer:
      'Recursion is implemented in searchGridRecursively() to find an available slot in the multi-floor 2D parking grid. The base cases are: (1) all floors checked (not found), and (2) free slot found. The recursive step advances through slots and floors until a base condition is met.',
  },
  {
    id: 'gc',
    title: 'Garbage Collection',
    subtitle: 'Object Lifecycle, Heap Deallocation & System.gc()',
    file: 'com.parking.management.demo.GarbageCollectionDemo',
    vivaQuestion: 'How does Garbage Collection work and why not use finalize()?',
    vivaAnswer:
      'Objects become eligible for GC when they become unreachable from GC roots (e.g., nullifying references or going out of scope). System.gc() sends a request to JVM but does NOT guarantee immediate execution. finalize() was deprecated in Java 9 because it causes memory leaks, performance issues, and unpredictable resurrection.',
  },
  {
    id: 'nested-classes',
    title: 'Nested & Inner Classes',
    subtitle: 'Static Nested (ParkingStatistics) vs Inner (SlotManager)',
    file: 'com.parking.management.demo.NestedClassDemo',
    vivaQuestion: 'What is the difference between static nested and non-static inner classes?',
    vivaAnswer:
      'Static nested classes (ParkingLot.ParkingStatistics) do not require an enclosing outer instance and cannot directly access non-static outer members. Non-static inner classes (ParkingLot.SlotManager) require an enclosing outer ParkingLot instance and have direct access to outer private fields like parkingGrid.',
  },
  {
    id: 'threads',
    title: 'Multithreading & Synchronization',
    subtitle: 'Thread vs Runnable, Lifecycle, join(), Locks, wait() & notify()',
    file: 'com.parking.management.demo.ThreadDemo',
    vivaQuestion: 'How is multithreading and synchronization used in your application?',
    vivaAnswer:
      'Two approaches are demonstrated: ParkingMonitor extends Thread and ReportGenerator implements Runnable. Thread lifecycle uses start() (not run()) and join(). Parking slot allocation is protected by synchronized methods to prevent race conditions during simultaneous requests. Inter-thread communication uses wait() and notifyAll() in ParkingRequestQueue.',
  },
];

export const VivaDemosPage: React.FC = () => {
  const [selectedDemoId, setSelectedDemoId] = useState(DEMOS[0].id);
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentDemo = DEMOS.find((d) => d.id === selectedDemoId) || DEMOS[0];

  const handleRunDemo = async () => {
    try {
      setLoading(true);
      setOutput(null);
      const res = await api.getDemo(selectedDemoId);
      setOutput(res.output);
    } catch (err: any) {
      setOutput('Error running demo: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              CSC2104 OOP Viva Demonstrations
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive test bench for course syllabus concepts with live backend code execution
          </p>
        </div>

        <button
          onClick={handleRunDemo}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4 fill-white" />
          )}
          <span>{loading ? 'Executing in Java...' : 'Run Live Demonstration'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {DEMOS.map((d) => (
          <button
            key={d.id}
            onClick={() => {
              setSelectedDemoId(d.id);
              setOutput(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedDemoId === d.id
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {d.title}
          </button>
        ))}
      </div>

      {/* Concept Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Viva Q&A & Academic Reference */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                Viva Exam Preparation
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-2">{currentDemo.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{currentDemo.subtitle}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-bold block mb-1">Expected Viva Question:</span>
                <p className="font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  "{currentDemo.vivaQuestion}"
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-1">Model Academic Answer:</span>
                <p className="text-slate-700 leading-relaxed bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200/80 text-[11px]">
                  {currentDemo.vivaAnswer}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 font-bold block mb-1">Source Code Class:</span>
                <code className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-1 rounded block truncate">
                  {currentDemo.file}.java
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Live Terminal Output */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-5 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-slate-200">
                Java Runtime Output ({currentDemo.file})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>
          </div>

          <div className="my-4 font-mono text-xs text-emerald-400 bg-black/40 p-4 rounded-xl min-h-[360px] max-h-[460px] overflow-y-auto whitespace-pre-wrap leading-relaxed border border-slate-800/80">
            {loading ? (
              <div className="flex items-center gap-2 text-slate-400">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Invoking {currentDemo.file}.executeAndCapture() in JVM...</span>
              </div>
            ) : output ? (
              output
            ) : (
              <div className="text-slate-500 space-y-2">
                <p>Click "Run Live Demonstration" above to execute this code inside the running Spring Boot backend.</p>
                <p className="text-slate-600 text-[11px]">
                  Output captures real System.out / string builder execution verifying the OOP syllabus in runtime.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span>Executable via console: java -cp target/classes {currentDemo.file}</span>
            <span className="text-emerald-400 font-mono">JDK 21 LTS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
