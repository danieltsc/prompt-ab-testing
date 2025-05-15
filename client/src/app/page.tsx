'use client'
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Eye, Trash2 } from 'lucide-react';

// Styled components
const Container = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;
const Card = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;
const CardHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;
const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
`;
const CardContent = styled.div`
  padding: 1rem;
`;
const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  resize: vertical;
  min-height: 3rem;
  margin-bottom: 0.5rem;
`;
const VariantRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;
const SelectInput = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
`;
const Button = styled.button`
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  margin: 0 0.25rem;
  color: #374151;
  &:hover { color: #1f2937; }
`;
const ControlPanel = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
`;
const TableHead = styled.th`
  text-align: left;
  padding: 0.5rem;
  font-weight: 500;
`;
const TableCell = styled.td`
  padding: 0.5rem;
  vertical-align: top;
`;
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;
const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
  position: relative;
`;
const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

export default function Home() {
  const [testCases, setTestCases] = useState<any>([]);
  const [newTestCase, setNewTestCase] = useState("");
  const [variants, setVariants] = useState<any>([]);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ prompt: "", response: "" });

  // Load defaults or from localStorage
  useEffect(() => {
    const defs = localStorage.getItem('testCases');
    setTestCases(defs ? JSON.parse(defs) : [
      { id: 1, text: "Paris: Known for its art, cuisine, and iconic landmarks like the Eiffel Tower and Louvre Museum." },
      { id: 2, text: "Kyoto: Famous for its historic temples, traditional tea ceremonies, and beautiful cherry blossoms in spring." },
      { id: 3, text: "Reykjavik: The capital of Iceland, offering geothermal pools, Northern Lights viewing, and unique volcanic landscapes." }
    ]);
    const vdefs = localStorage.getItem('variants');
    setVariants(vdefs ? JSON.parse(vdefs) : [
      { id: 'A', template: "Summarize the key attractions of this destination in three bullet points:" },
      { id: 'B', template: "Write a catchy introductory paragraph about this travel destination:" },
      { id: 'C', template: "List three fun facts travelers should know about this place:" }
    ]);
    const sel = localStorage.getItem('selectedVariant');
    setSelectedVariant(sel || 'A');
  }, []);

  // Persist
  useEffect(() => { localStorage.setItem('testCases', JSON.stringify(testCases)); }, [testCases]);
  useEffect(() => { localStorage.setItem('variants', JSON.stringify(variants)); }, [variants]);
  useEffect(() => { localStorage.setItem('selectedVariant', selectedVariant); }, [selectedVariant]);

  const addTestCase = () => {
    if (!newTestCase.trim()) return;
    const nextId = testCases.length ? Math.max(...testCases.map(tc => tc.id)) + 1 : 1;
    setTestCases([...testCases, { id: nextId, text: newTestCase.trim() }]);
    setNewTestCase("");
  };
  const deleteTestCase = (id) => setTestCases(testCases.filter(tc => tc.id !== id));
  const addVariant = () => {
    const nextId = String.fromCharCode(65 + variants.length);
    setVariants([...variants, { id: nextId, template: "New prompt template..." }]);
  };
  const updateVariant = (id, template) => setVariants(variants.map(v => v.id === id ? { ...v, template } : v));
  const deleteVariant = (id) => {
    setVariants(variants.filter(v => v.id !== id));
    if (selectedVariant === id && variants.length > 1) {
      setSelectedVariant(variants.find(v => v.id !== id).id);
    }
  };

  const runAbTest = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/abtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testCases, variants, selectedVariant })
      });
      const data = await res.json();
      setResults(data);  // expected { [caseId]: "response" }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (prompt, response) => {
    setModalContent({ prompt, response });
    setModalOpen(true);
  };

  return (
    <Container>
      {/* Test Cases section */}
      <Card>
        <CardHeader><CardTitle>Test Cases</CardTitle></CardHeader>
        <CardContent>
          <TextArea placeholder="Enter a new test case..." value={newTestCase} onChange={e => setNewTestCase(e.target.value)} />
          <Button onClick={addTestCase}>Add Test Case</Button>
        </CardContent>
      </Card>

      {/* Variants */}
      <Card>
        <CardHeader><CardTitle>Prompt Variants</CardTitle></CardHeader>
        <CardContent>
          {variants.map(v => (
            <VariantRow key={v.id}>
              <span style={{ fontWeight: 600, marginTop: '0.5rem' }}>Variant {v.id}:</span>
              <TextArea value={v.template} onChange={e => updateVariant(v.id, e.target.value)} />
              <IconButton onClick={() => deleteVariant(v.id)}><Trash2 size={16} /></IconButton>
            </VariantRow>
          ))}
          <Button onClick={addVariant}>Add Variant</Button>
        </CardContent>
      </Card>

      {/* Dashboard */}
      <Card>
        <CardHeader><CardTitle>A/B Test Dashboard</CardTitle></CardHeader>
        <CardContent>
          <ControlPanel>
            <label style={{ fontWeight: 500 }}>Select Variant:</label>
            <SelectInput value={selectedVariant} onChange={e => setSelectedVariant(e.target.value)}>
              {variants.map(v => <option key={v.id} value={v.id}>Variant {v.id}</option>)}
            </SelectInput>
            <Button onClick={runAbTest} disabled={loading}>{loading ? 'Running...' : 'Run A/B Test'}</Button>
          </ControlPanel>
          <Table>
            <thead>
              <TableRow>
                <TableHead>Test Case</TableHead>
                <TableHead>Output</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </thead>
            <tbody>
              {testCases.map(tc => {
                const prompt = `${variants.find((v: any) => v.id === selectedVariant)?.template} ${tc.text}`;
                const resp = results[tc.id] || '';
                return (<TableRow key={tc.id}>
                  <TableCell>{tc.text}</TableCell>
                  <TableCell>{resp}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => openModal(prompt, resp)}><Eye size={16} /></IconButton>
                    <IconButton onClick={() => deleteTestCase(tc.id)}><Trash2 size={16} /></IconButton>
                  </TableCell>
                </TableRow>);
              })}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      {modalOpen && (
        <ModalOverlay onClick={() => setModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={() => setModalOpen(false)}>&times;</CloseButton>
            <h3>Prompt</h3>
            <pre style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '0.375rem' }}>{modalContent.prompt}</pre>
            <h3>Response</h3>
            <pre style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '0.375rem' }}>{modalContent.response}</pre>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
