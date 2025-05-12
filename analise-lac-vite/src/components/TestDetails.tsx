import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import { FaEye, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover"

interface Teste {
  id: string;
  produto: string;
  fabricante: string;
  tipoEmbalagem: string;
  pesoProduto: string;
  dataFabricacao: string;
  dataValidade: string;
  dataTeste: string;
  horarioTeste: string;
  localTeste: string;
  tipoTeste: string;
  quantidadeAvaliadores: number;
  atributosAvaliados: string[];
  tipoAnaliseEstatistica: string;
  status: string;
  dataCriacao: string;
  analistaId: string;
  criadoPor: string;
  atualizadoEm: string;
  respostas: any[];
  totalRespostas: number;
  amostras: string[];
  descricao?: string;
}

          <Popover>
            <PopoverTrigger asChild>
              <button className="text-[#8BA989] hover:text-[#6E8F6E]">
                <FaEye className="h-5 w-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="flex flex-col space-y-2">
                <h4 className="font-medium leading-none text-[#8BA989]">Detalhes do Teste</h4>
                <p className="text-sm text-[#666666]">
                  {teste.descricao || 'Nenhuma descrição disponível.'}
                </p>
              </div>
            </PopoverContent>
          </Popover> 