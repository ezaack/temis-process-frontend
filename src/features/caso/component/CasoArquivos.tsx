import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useUserContext } from '../../../context/UserContext';
import { arquivoService, Arquivo, UploadArquivoRequest } from '../api/arquivos';
import { useToast } from '../../../hooks/useToast';

interface CasoArquivosProps {
  casoId: string;
}

// Validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

interface UploadProgress {
  [key: string]: number;
}

interface DeleteConfirmation {
  arquivo: Arquivo | null;
  isOpen: boolean;
}

const CasoArquivos: React.FC<CasoArquivosProps> = ({ casoId }) => {
  const { user } = useUserContext();
  const groupId = user?.userData?.officeGroupId || '';
  const toast = useToast();

  const [arquivos, setArquivos] = useState<Arquivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showUploadPreview, setShowUploadPreview] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    arquivo: null,
    isOpen: false,
  });
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Fetch arquivos
  const fetchArquivos = useCallback(async () => {
    if (!groupId || !casoId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await arquivoService.getArquivosByCaso(groupId, casoId);
      setArquivos(data);
      if (retryCount > 0) {
        toast.success('Sucesso', 'Arquivos recarregados');
      }
    } catch (err) {
      console.error('Error fetching arquivos:', err);
      const errorMsg = 'Erro ao carregar arquivos';
      setError(errorMsg);
      if (retryCount === 0) {
        toast.error('Erro', errorMsg);
      }
    } finally {
      setLoading(false);
    }
  }, [casoId, groupId, retryCount]);  // Added retryCount

  useEffect(() => {
    fetchArquivos();
  }, [fetchArquivos]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    toast.info('Recarregando', 'Buscando arquivos...');
  };

  // File validation
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `Arquivo "${file.name}" excede 10MB. Selecione um arquivo menor.`,
      };
    }

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        valid: false,
        error: `Formato de "${file.name}" não suportado. Use: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG`,
      };
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Tipo de arquivo "${file.name}" não suportado.`,
      };
    }

    // Check for duplicate filename
    const isDuplicate = arquivos.some(a => a.nomeOriginal === file.name);
    if (isDuplicate) {
      return {
        valid: false,
        error: `Arquivo "${file.name}" já existe. Renomeie ou substitua.`,
      };
    }

    return { valid: true };
  };

  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else if (validation.error) {
        errors.push(validation.error);
      }
    });

    if (errors.length > 0) {
      errors.forEach(error => toast.error('Validação', error));
    }

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      setShowUploadPreview(true);
    }
  };

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if we're leaving the drop zone itself
    if (e.currentTarget === dropZoneRef.current) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [arquivos]);

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  // Remove file from selection
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    if (selectedFiles.length === 1) {
      setShowUploadPreview(false);
    }
  };

  // Cancel upload preview
  const cancelUpload = () => {
    setSelectedFiles([]);
    setShowUploadPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload files
  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !groupId) return;

    setUploading(true);
    const newProgress: UploadProgress = {};
    selectedFiles.forEach(file => {
      newProgress[file.name] = 0;
    });
    setUploadProgress(newProgress);

    try {
      const uploadPromises = selectedFiles.map(async file => {
        const uploadData: UploadArquivoRequest = { file };

        // Simulate progress (in real implementation, use XMLHttpRequest or similar)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: Math.min((prev[file.name] || 0) + 10, 90),
          }));
        }, 100);

        try {
          const uploaded = await arquivoService.uploadArquivo(groupId, casoId, uploadData);

          clearInterval(progressInterval);
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));

          return uploaded;
        } catch (err) {
          clearInterval(progressInterval);
          throw err;
        }
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      // Add uploaded files to the list
      setArquivos(prev => [...uploadedFiles, ...prev]);

      // Show success toast
      if (uploadedFiles.length === 1) {
        toast.success('Sucesso', 'Arquivo enviado com sucesso');
      } else {
        toast.success('Sucesso', `${uploadedFiles.length} arquivos enviados com sucesso`);
      }

      // Reset state
      setSelectedFiles([]);
      setShowUploadPreview(false);
      setUploadProgress({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Erro no Upload', 'Falha no upload. Verifique sua conexão e tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  // Download file
  const handleDownload = async (arquivo: Arquivo) => {
    if (!groupId) return;

    try {
      setDownloading(arquivo.id);

      const blob = await arquivoService.downloadArquivo(groupId, casoId, arquivo.id);

      // Trigger browser download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = arquivo.nomeOriginal;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Sucesso', 'Download iniciado');
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Erro no Download', 'Falha no download. Tente novamente.');
    } finally {
      setDownloading(null);
    }
  };

  // Delete file - open confirmation
  const openDeleteConfirmation = (arquivo: Arquivo) => {
    setDeleteConfirmation({ arquivo, isOpen: true });
  };

  // Delete file - cancel
  const cancelDelete = () => {
    setDeleteConfirmation({ arquivo: null, isOpen: false });
  };

  // Delete file - confirm
  const confirmDelete = async () => {
    const { arquivo } = deleteConfirmation;
    if (!arquivo || !groupId) return;

    try {
      setDeleting(true);

      // Optimistically remove from UI
      setArquivos(prev => prev.filter(a => a.id !== arquivo.id));

      await arquivoService.deleteArquivo(groupId, casoId, arquivo.id);

      toast.success('Sucesso', 'Arquivo excluído com sucesso');
      setDeleteConfirmation({ arquivo: null, isOpen: false });
    } catch (err) {
      console.error('Delete error:', err);
      // Rollback on error
      await fetchArquivos();
      toast.error('Erro ao Excluir', 'Falha ao excluir arquivo. Tente novamente.');
    } finally {
      setDeleting(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Format relative time
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
    return date.toLocaleDateString('pt-BR');
  };

  // Get file icon based on extension
  const getFileIcon = (extensao: string): string => {
    const ext = extensao.toLowerCase();
    if (['pdf'].includes(ext)) return '📄';
    if (['doc', 'docx'].includes(ext)) return '📝';
    if (['xls', 'xlsx'].includes(ext)) return '📊';
    if (['jpg', 'jpeg', 'png'].includes(ext)) return '🖼️';
    return '📎';
  };

  return (
    <div
      id="section-arquivos"
      className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      {/* Header */}
      <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-black dark:text-white">
            Arquivos {arquivos.length > 0 && `(${arquivos.length})`}
          </h3>
          {!showUploadPreview && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white transition"
            >
              + Upload
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-lg border border-danger bg-danger bg-opacity-10 p-4 text-center">
            <p className="text-danger">{error}</p>
            <button
              onClick={fetchArquivos}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Upload Preview */}
        {showUploadPreview && (
          <div className="mb-6 rounded-lg border border-stroke bg-gray-2 p-4 dark:border-strokedark dark:bg-meta-4">
            <h4 className="mb-3 font-medium text-black dark:text-white">
              Arquivos selecionados ({selectedFiles.length}):
            </h4>
            <div className="space-y-2 mb-4">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white rounded p-3 dark:bg-boxdark"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getFileIcon(file.name.split('.').pop() || '')}</span>
                    <div>
                      <p className="font-medium text-sm text-black dark:text-white">
                        {file.name}
                      </p>
                      <p className="text-xs text-bodydark">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  {!uploading && (
                    <button
                      onClick={() => removeSelectedFile(index)}
                      className="text-danger hover:text-opacity-80"
                    >
                      Remover
                    </button>
                  )}
                  {uploading && uploadProgress[file.name] !== undefined && (
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-stroke rounded-full h-2 dark:bg-strokedark">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${uploadProgress[file.name]}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-bodydark">
                        {uploadProgress[file.name]}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelUpload}
                disabled={uploading}
                className="rounded border border-stroke px-4 py-2 hover:bg-gray disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || selectedFiles.length === 0}
                className="rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                {uploading ? 'Fazendo Upload...' : 'Fazer Upload'}
              </button>
            </div>
          </div>
        )}

        {/* Drop Zone (only show when not uploading and no preview) */}
        {!loading && !error && !showUploadPreview && (
          <div
            ref={dropZoneRef}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mb-6 cursor-pointer border-2 border-dashed rounded-lg p-6 sm:p-12 text-center transition min-h-[160px] flex flex-col items-center justify-center ${
              isDragging
                ? 'border-primary bg-primary bg-opacity-5'
                : 'border-stroke bg-gray-2 dark:bg-meta-4 dark:border-strokedark'
            }`}
          >
            <div className="mb-2 sm:mb-4 text-3xl sm:text-4xl">📎</div>
            <p className="text-bodydark mb-1 sm:mb-2 text-sm sm:text-base">
              {isDragging
                ? 'Solte os arquivos aqui'
                : (
                  <>
                    <span className="sm:hidden">Toque para selecionar arquivos</span>
                    <span className="hidden sm:inline">Arraste arquivos aqui ou clique para selecionar</span>
                  </>
                )}
            </p>
            <p className="text-xs sm:text-sm text-bodydark mb-1">
              PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
            </p>
            <p className="text-xs sm:text-sm text-bodydark">Máx. 10MB por arquivo</p>
          </div>
        )}

        {/* File List */}
        {!loading && !error && arquivos.length > 0 && (
          <div className="space-y-2 sm:space-y-3">
            {arquivos.map((arquivo, index) => (
              <div
                key={arquivo.id}
                className="flex items-center justify-between border border-stroke rounded-lg p-3 sm:p-4 hover:bg-gray-2 transition dark:border-strokedark dark:hover:bg-meta-4 min-h-[72px]"
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <span className="text-xl sm:text-2xl flex-shrink-0">{getFileIcon(arquivo.extensao)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm sm:text-base font-medium text-black dark:text-white truncate max-w-[200px] sm:max-w-none">
                        {arquivo.nomeOriginal}
                      </p>
                      {index === 0 && (
                        <span className="text-xs bg-success bg-opacity-10 text-success px-2 py-0.5 rounded">
                          Novo
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-bodydark truncate">
                      {formatFileSize(arquivo.tamanho)} <span className="hidden sm:inline">• Enviado {formatRelativeTime(arquivo.uploadedAt)} por{' '}
                      {arquivo.uploadedBy}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(arquivo)}
                    disabled={downloading === arquivo.id}
                    className="inline-flex items-center justify-center rounded border border-stroke px-3 py-2 text-sm hover:bg-gray disabled:opacity-50 dark:border-strokedark dark:hover:bg-meta-4"
                  >
                    {downloading === arquivo.id ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
                      </span>
                    ) : (
                      '↓ Download'
                    )}
                  </button>
                  <button
                    onClick={() => openDeleteConfirmation(arquivo)}
                    className="inline-flex items-center justify-center rounded border border-danger bg-danger bg-opacity-10 px-3 py-2 text-sm text-danger hover:bg-opacity-20"
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && arquivos.length === 0 && !showUploadPreview && (
          <div className="text-center py-8 text-bodydark">
            <div className="text-4xl mb-3">📁</div>
            <p>Nenhum arquivo anexado ainda</p>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ALLOWED_EXTENSIONS.map(ext => `.${ext}`).join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation.isOpen && deleteConfirmation.arquivo && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-xl dark:bg-boxdark sm:p-6">
            <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
              <span className="text-xl sm:text-2xl">⚠️</span>
              <h3 className="text-lg font-semibold text-black dark:text-white sm:text-xl">
                Confirmar exclusão
              </h3>
            </div>

            <p className="mb-4 text-sm text-body dark:text-bodydark sm:mb-6 sm:text-base">
              Tem certeza que deseja excluir{' '}
              <strong className="text-black dark:text-white">
                "{deleteConfirmation.arquivo.nomeOriginal}"
              </strong>
              ?<br />
              Esta ação não pode ser desfeita.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                disabled={deleting}
                className="rounded border border-stroke px-4 py-2 hover:bg-gray disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded bg-danger px-4 py-2 text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                {deleting ? 'Excluindo...' : 'Excluir Arquivo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasoArquivos;
