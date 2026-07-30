import { useState } from 'react';
import { useLayout } from '../../contexts/LayoutContext';

const layouts = [
  { id: 'classic', label: 'Classic', icon: 'pi pi-th-large' },
  { id: 'terminal', label: 'Terminal', icon: 'pi pi-code' },
  { id: 'neon', label: 'Neon', icon: 'pi pi-bolt' },
  { id: '90s', label: '90s', icon: 'pi pi-star' },
];

const LayoutSwitcher = () => {
  const { layout, setLayout } = useLayout();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
        aria-label="Switch layout"
      >
        <i className={`pi pi-palette text-xl ${isOpen ? 'rotate-90' : ''} transition-transform duration-300`}></i>
      </button>

      {isOpen && (
        <>
          <div className="absolute bottom-16 right-0 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl p-2 shadow-xl min-w-[200px]">
            {layouts.map((l) => (
              <button
                key={l.id}
                onClick={() => { setLayout(l.id); setIsOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors cursor-pointer ${
                  layout === l.id
                    ? 'bg-indigo-600/20 text-indigo-400'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <i className={l.icon}></i>
                <span>{l.label}</span>
                {layout === l.id && <i className="pi pi-check ml-auto text-xs"></i>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LayoutSwitcher;
