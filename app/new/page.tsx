'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, ChevronLeft } from 'lucide-react';

import { useStore, computeTotal } from '@/lib/store';
import { InvoiceItem } from '@/lib/types';
import { createInvoice, updateInvoice as updateInvoiceDB, getNextNumber } from '@/lib/actions';

import ScreenHeader from '@/components/ScreenHeader';
import SFab from '@/components/SFab';
import BottomSheet from '@/components/BottomSheet';
import SignaturePad from '@/components/SignaturePad';

import EditFormPanel from './_components/EditFormPanel';
import DocPreviewCard from './_components/DocPreviewCard';
import EditBottomBar from './_components/EditBottomBar';
import DoneBottomBar from './_components/DoneBottomBar';

type SignSlot = 'from' | 'driver' | null;

type Phase = 'edit' | 'done';
type Tab = 'form' | 'preview';

const TRANS = 'opacity 0.28s ease, transform 0.3s cubic-bezier(0.34,1.2,0.64,1)';

const uid = () => Math.random().toString(36).slice(2, 10);
const todayISO = () => new Date().toISOString().slice(0, 10);

export default function NewPage() {
  const router = useRouter();
  const { addInvoice, updateInvoice } = useStore();

  // ── Draft state ────────────────────────────────────────────────
  const [savedId]  = useState(uid);
  const [number, setNumber] = useState<string>('—');
  const [date]    = useState(todayISO);
  const [fromPerson, setFromPerson] = useState('');
  const [vehicle,    setVehicle]    = useState('');
  const [driver,     setDriver]     = useState('');
  const [items,      setItems]      = useState<InvoiceItem[]>([]);
  const [signatureFrom,   setSignatureFrom]   = useState<string>('');
  const [signatureDriver, setSignatureDriver] = useState<string>('');

  // ── UI state ───────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>('edit');
  const [tab,   setTab]   = useState<Tab>('form');
  const [sheetOpen,   setSheetOpen]   = useState(false);
  const [editingItem, setEditingItem] = useState<InvoiceItem | null>(null);
  const [saved, setSaved] = useState(false);
  const [signSlot, setSignSlot] = useState<SignSlot>(null);

  // Authoritative number from server
  useEffect(() => {
    getNextNumber().then(setNumber).catch(() => {});
  }, []);

  const totalQty = computeTotal(items);
  const invoice = {
    id: savedId, number, date, fromPerson, vehicle, driver,
    signatureFrom, signatureDriver, items,
    status: 'draft' as const, createdAt: '', updatedAt: '',
  };

  // ── Handlers ───────────────────────────────────────────────────
  const handleAddItem = (sku: string, qty: number) =>
    setItems(prev => [...prev, { id: uid(), sku, qty }]);
  const handleEditItem = (id: string, sku: string, qty: number) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, sku, qty } : it));
    setEditingItem(null);
  };
  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const openEdit = (item: InvoiceItem) => { setEditingItem(item); setSheetOpen(true); };
  const closeSheet = () => { setSheetOpen(false); setEditingItem(null); };

  async function persistDraft(): Promise<void> {
    const now = new Date().toISOString();
    if (!saved) {
      const inv = { ...invoice, status: 'draft' as const, createdAt: now, updatedAt: now };
      addInvoice(inv);
      setSaved(true);
      await createInvoice(inv);
    } else {
      const patch = { fromPerson, vehicle, driver, signatureFrom, signatureDriver, items };
      updateInvoice(savedId, patch);
      await updateInvoiceDB(savedId, patch);
    }
  }

  async function saveSignature(slot: 'from' | 'driver', svg: string) {
    if (slot === 'from')  setSignatureFrom(svg);
    if (slot === 'driver') setSignatureDriver(svg);
    if (saved) {
      const patch = slot === 'from' ? { signatureFrom: svg } : { signatureDriver: svg };
      updateInvoice(savedId, patch);
      await updateInvoiceDB(savedId, patch).catch(() => {});
    }
  }

  async function handleDone() {
    await persistDraft();
    setPhase('done');
  }

  async function handleSaveAndExit() {
    await persistDraft();
    router.push('/');
  }

  const editVisible = phase === 'edit';
  const doneVisible = phase === 'done';

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--paper-dim)', position: 'relative', overflow: 'hidden' }}>

      {/* Headers */}
      <div className="no-print" style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        opacity: editVisible ? 1 : 0,
        transform: editVisible ? 'translateY(0)' : 'translateY(-12px)',
        pointerEvents: editVisible ? 'auto' : 'none',
        transition: TRANS,
      }}>
        <ScreenHeader
          title="Новая накладная"
          left={<X size={18} />}
          right="Сохр."
          onLeft={() => router.back()}
          onRight={handleSaveAndExit}
        />
      </div>

      <div className="no-print" style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        opacity: doneVisible ? 1 : 0,
        transform: doneVisible ? 'translateY(0)' : 'translateY(12px)',
        pointerEvents: doneVisible ? 'auto' : 'none',
        transition: TRANS,
      }}>
        <ScreenHeader
          title={`Накладная № ${number}`}
          left={<ChevronLeft size={22} />}
          onLeft={() => setPhase('edit')}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, position: 'relative', marginTop: 57 }}>

        {/* EDIT */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          opacity: editVisible ? 1 : 0,
          transform: editVisible ? 'scale(1) translateY(0)' : 'scale(0.97) translateY(-20px)',
          pointerEvents: editVisible ? 'auto' : 'none',
          transition: TRANS,
        }}>
          <EditFormPanel
            tab={tab}
            onTabChange={setTab}
            number={number}
            date={date}
            fromPerson={fromPerson}
            vehicle={vehicle}
            driver={driver}
            items={items}
            onFromPersonChange={setFromPerson}
            onVehicleChange={setVehicle}
            onDriverChange={setDriver}
            onEditItem={openEdit}
            onRemoveItem={removeItem}
            onAddItemClick={() => setSheetOpen(true)}
            previewSlot={<DocPreviewCard invoice={invoice} shadow="sm" />}
          />
        </div>

        {/* DONE */}
        <div className="print-scroll" style={{
          position: 'absolute', inset: 0, overflowY: 'auto',
          background: 'var(--paper-deep)',
          opacity: doneVisible ? 1 : 0,
          transform: doneVisible ? 'translateY(0)' : 'translateY(36px)',
          pointerEvents: doneVisible ? 'auto' : 'none',
          transition: TRANS,
        }}>
          <DocPreviewCard
            invoice={invoice}
            shadow="lg"
            onSignFrom={() => setSignSlot('from')}
            onSignDriver={() => setSignSlot('driver')}
          />
        </div>
      </div>

      <EditBottomBar visible={editVisible} itemsCount={items.length} totalQty={totalQty} onDone={handleDone} />
      <DoneBottomBar visible={doneVisible} number={number} />

      <SignaturePad
        open={signSlot !== null}
        title={signSlot === 'from' ? 'Подпись передавшего' : 'Подпись водителя'}
        initial={signSlot === 'from' ? signatureFrom : signatureDriver}
        onClose={() => setSignSlot(null)}
        onSave={svg => { if (signSlot) saveSignature(signSlot, svg); }}
      />

      <SFab
        onClick={() => setSheetOpen(true)}
        style={{
          position: 'fixed', right: 18, bottom: 108, zIndex: 25,
          opacity: (editVisible && tab === 'form') ? 1 : 0,
          pointerEvents: (editVisible && tab === 'form') ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
        }}
        className="no-print"
      />

      <BottomSheet
        open={sheetOpen}
        onClose={closeSheet}
        onAdd={handleAddItem}
        editItem={editingItem ?? undefined}
        onEdit={handleEditItem}
      />
    </div>
  );
}
