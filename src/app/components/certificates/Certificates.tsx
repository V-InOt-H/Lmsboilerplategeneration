import { useState, useEffect } from 'react';
import { certificatesAPI } from '../../../services/api';
import { Award, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await certificatesAPI.getAll();
      setCertificates(response.certificates || []);
    } catch (err) {
      console.error('Failed to fetch certificates:', err);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading certificates...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">My Certificates</h2>
        <p className="text-indigo-300 mt-1">View and download your earned certificates</p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-12 text-center">
          <Award className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
          <p className="text-white font-medium mb-2">No certificates earned yet</p>
          <p className="text-indigo-300">Complete courses to earn certificates!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <div
              key={certificate._id}
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden hover:border-indigo-500/50 transition-all"
            >
              <div className="h-40 bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center relative">
                <Award className="w-16 h-16 text-white opacity-30" />
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium">
                  Certificate
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-white font-bold text-lg mb-2">{certificate.course?.title}</h3>
                <div className="space-y-2 text-sm text-indigo-300 mb-4">
                  <p>Certificate #: {certificate.certificateNumber}</p>
                  <p>Issued: {new Date(certificate.issuedDate).toLocaleDateString()}</p>
                  <p>Score: {certificate.finalScore}%</p>
                </div>
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
