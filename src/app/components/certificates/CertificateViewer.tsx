import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { certificatesAPI, coursesAPI } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import Certificate from './Certificate';

// Lazy load html2pdf
const html2pdfPromise = import('html2pdf.js');

interface CertificateData {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  course: {
    _id: string;
    title: string;
    category: string;
  };
  certificateNumber: string;
  issuedAt: string;
  completionDate: string;
}

export default function CertificateViewer() {
  const { certificateId } = useParams<{ certificateId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const certificateRef = useRef<HTMLDivElement>(null);
  
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificate();
  }, [certificateId]);

  const fetchCertificate = async () => {
    if (!certificateId) return;
    
    try {
      setLoading(true);
      const response = await certificatesAPI.getOne(certificateId);
      setCertificate(response.certificate);
      
      if (response.certificate?.course) {
        const courseResponse = await coursesAPI.getOne(response.certificate.course._id);
        setCourse(courseResponse.course);
      }
    } catch (err) {
      console.error('Failed to fetch certificate:', err);
      toast.error('Failed to load certificate');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      const html2pdfModule = await html2pdfPromise;
      const html2pdf = html2pdfModule.default;
      
      const element = certificateRef.current;
      if (!element) return;
      
      const opt = {
        margin: 0,
        filename: `certificate-${certificate?.certificateNumber || 'download'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      };
      
      await html2pdf().set(opt).from(element).save();
      toast.success('Certificate downloaded successfully!');
    } catch (err) {
      console.error('Failed to download PDF:', err);
      // Fallback to print
      window.print();
    }
  };

  // Authority details from settings or defaults
  const authorityName = 'Dr. Sarah Mitchell';
  const authorityTitle = 'Director of Learning & Development';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <div className="text-white text-xl">Loading certificate...</div>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="text-white text-xl">Certificate not found</div>
        <Button onClick={() => navigate('/certificates')} className="bg-indigo-500">
          Back to Certificates
        </Button>
      </div>
    );
  }

  const completionDate = new Date(certificate.completionDate || certificate.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-100 py-8 print:bg-white print:py-0">
      {/* Actions */}
      <div className="max-w-7xl mx-auto px-4 mb-6 flex items-center justify-between print:hidden">
        <Button 
          onClick={() => navigate(-1)} 
          variant="ghost" 
          className="text-white hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="flex gap-3">
          <Button 
            onClick={handlePrint}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button 
            onClick={handleDownloadPDF}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Certificate Display */}
      <div className="flex justify-center print:justify-center print:w-full">
        <Certificate
          ref={certificateRef}
          learnerName={certificate.user?.name || user?.name || 'Student'}
          courseName={course?.title || certificate.course?.title || 'Course'}
          completionDate={completionDate}
          certificateId={certificate.certificateNumber}
          authorityName={authorityName}
          authorityTitle={authorityTitle}
        />
      </div>
    </div>
  );
}

