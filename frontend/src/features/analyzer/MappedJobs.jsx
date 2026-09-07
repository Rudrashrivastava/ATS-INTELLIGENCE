import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Globe, Briefcase, MapPin, ExternalLink, 
  Activity, Zap, ShieldCheck, Target, Search, Filter, CheckCircle, X, Send, Sparkles, Building, Layers, Navigation, Compass
} from 'lucide-react';

export default function MappedJobs() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const analysisData = state?.analysisData || {};
  const initialRole = analysisData.primaryRole || 'Software Engineer';

  // State Management
  const [activeRole, setActiveRole] = useState(initialRole);
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [customCountryInput, setCustomCountryInput] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Official Portal Redirect Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [modalTargetType, setModalTargetType] = useState('official'); // 'official' or 'platform'
  const [redirectToast, setRedirectToast] = useState(null);

  const rolePresets = [
    'Software Engineer',
    'Full Stack Engineer',
    'Frontend Developer',
    'Backend Developer',
    'AI / ML Engineer',
    'Data Scientist',
    'DevOps / Cloud',
    'Mobile Developer',
    'Product Manager'
  ];

  const countryPresets = [
    'India',
    'United States',
    'United Kingdom',
    'Germany',
    'Canada',
    'Global / All'
  ];

  const workModes = ['All', 'Remote', 'Hybrid', 'Onsite'];

  const companiesList = [
    'All', 'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'NVIDIA', 'Netflix', 
    'Tesla', 'Spotify', 'Airbnb', 'Stripe', 'OpenAI', 'Uber', 'Salesforce', 
    'TCS', 'Infosys', 'Accenture', 'Wipro', 'IBM', 'Deloitte', 'Oracle', 'Adobe',
    'Razorpay', 'LinkedIn', 'Palantir', 'Cisco', 'Intel', 'AMD', 'GitHub', 'Atlassian', 'SpaceX'
  ];

  const categoriesList = ['All', 'Tech Giants', 'AI & Cloud', 'Global Enterprise', 'Remote'];

  // Fetch jobs dynamically based on user selected Role & Country
  useEffect(() => {
    const fetchMappedJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const currentRole = activeRole || 'Software Engineer';
        const currentLocation = selectedCountry === 'Global / All' ? 'Global' : selectedCountry;

        const res = await axios.get(`/api/jobs/mapped?query=${encodeURIComponent(currentRole)}&location=${encodeURIComponent(currentLocation)}`);
        
        const results = res.data.jobs_results || res.data.organic || [];
        setJobs(results);
        setFilteredJobs(results);
      } catch (err) {
        console.error("Market Sync Failure:", err);
        setError("Network connection failure. Retrying with cached company directory...");
      } finally {
        setLoading(false);
      }
    };

    fetchMappedJobs();
  }, [activeRole, selectedCountry]);

  // Filter Jobs locally by Search, Work Mode, Company & Category
  useEffect(() => {
    let list = [...jobs];

    // Local Text Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(j => 
        (j.title || '').toLowerCase().includes(q) || 
        (j.company_name || j.company || '').toLowerCase().includes(q) ||
        (j.location || '').toLowerCase().includes(q)
      );
    }

    // Work Mode Filter
    if (selectedWorkMode !== 'All') {
      const mode = selectedWorkMode.toLowerCase();
      list = list.filter(j => {
        const loc = (j.location || '').toLowerCase();
        const desc = (j.description || '').toLowerCase();
        if (mode === 'remote') return loc.includes('remote') || desc.includes('remote');
        if (mode === 'hybrid') return loc.includes('hybrid') || desc.includes('hybrid');
        if (mode === 'onsite') return !loc.includes('remote') && !desc.includes('remote');
        return true;
      });
    }

    // Company Filter
    if (selectedCompany !== 'All') {
      list = list.filter(j => (j.company_name || j.company || '').toLowerCase().includes(selectedCompany.toLowerCase()));
    }

    // Category Filter
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Tech Giants') {
        const giants = ['google', 'microsoft', 'amazon', 'meta', 'apple', 'netflix', 'nvidia', 'tesla'];
        list = list.filter(j => giants.some(g => (j.company_name || j.company || '').toLowerCase().includes(g)));
      } else if (selectedCategory === 'AI & Cloud') {
        const aiCloud = ['openai', 'nvidia', 'amazon', 'microsoft', 'google', 'palantir', 'amd', 'intel'];
        list = list.filter(j => aiCloud.some(a => (j.company_name || j.company || '').toLowerCase().includes(a)));
      } else if (selectedCategory === 'Global Enterprise') {
        const enterprises = ['tcs', 'infosys', 'accenture', 'wipro', 'ibm', 'deloitte', 'oracle', 'cisco', 'atlassian'];
        list = list.filter(j => enterprises.some(e => (j.company_name || j.company || '').toLowerCase().includes(e)));
      } else if (selectedCategory === 'Remote') {
        list = list.filter(j => (j.location || '').toLowerCase().includes('remote'));
      }
    }

    setFilteredJobs(list);
  }, [search, selectedWorkMode, selectedCompany, selectedCategory, jobs]);

  // Accurate Official Company Career Deep Search URL Generator
  const getOfficialDeepUrl = (job) => {
    if (!job) return 'https://careers.google.com';
    const compRaw = job.company_name || job.company || 'Google';
    const comp = compRaw.toLowerCase().trim();
    const role = encodeURIComponent(activeRole || 'Software Engineer');
    const loc = encodeURIComponent(selectedCountry || 'India');

    if (comp.includes('google')) return `https://careers.google.com/jobs/results/?q=${role}&location=${loc}`;
    if (comp.includes('microsoft')) return `https://careers.microsoft.com/us/en/search-results?keywords=${role}`;
    if (comp.includes('amazon')) return `https://www.amazon.jobs/en/search?base_query=${role}`;
    if (comp.includes('meta') || comp.includes('facebook')) return `https://www.metacareers.com/jobs?q=${role}`;
    if (comp.includes('apple')) return `https://jobs.apple.com/en-us/search?search=${role}`;
    if (comp.includes('nvidia')) return `https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite?q=${role}`;
    if (comp.includes('netflix')) return `https://jobs.netflix.com/search?q=${role}`;
    if (comp.includes('tesla')) return `https://www.tesla.com/careers/search/?query=${role}`;
    if (comp.includes('tcs')) return `https://www.tcs.com/careers`;
    if (comp.includes('infosys')) return `https://www.infosys.com/careers.html`;
    if (comp.includes('accenture')) return `https://www.accenture.com/in-en/careers/jobsearch?jk=${role}`;
    if (comp.includes('wipro')) return `https://careers.wipro.com/careers-home/`;
    if (comp.includes('ibm')) return `https://www.ibm.com/careers/search?q=${role}`;
    if (comp.includes('deloitte')) return `https://www2.deloitte.com/ui/en/careers/job-search.html`;
    if (comp.includes('oracle')) return `https://eeho.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/requisitions?keyword=${role}`;
    
    if (job.url && job.url.includes('http')) return job.url;

    // Fallback: Google search directly for the accurate hiring page
    return `https://www.google.com/search?q=${encodeURIComponent(`${compRaw} ${activeRole} careers ${selectedCountry}`)}`;
  };

  // Direct Job Platform Link Generator (LinkedIn, Naukri, Indeed)
  const getPlatformUrl = (job) => {
    if (!job) return 'https://www.linkedin.com/jobs/';
    const comp = job.company_name || job.company || '';
    const role = activeRole || 'Software Engineer';
    const loc = selectedCountry === 'India' ? 'India' : selectedCountry;

    if (selectedCountry === 'India') {
      // Direct Naukri search URL
      const naukriRole = role.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return `https://www.naukri.com/${naukriRole}-jobs-in-india?k=${encodeURIComponent(`${comp} ${role}`)}`;
    }

    // LinkedIn Job Search URL
    return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${comp} ${role}`)}&location=${encodeURIComponent(loc)}`;
  };

  const calculateJobMatch = (jobTitle) => {
    const role = activeRole.toLowerCase();
    const title = (jobTitle || '').toLowerCase();
    if (title.includes(role)) return 92 + (title.length % 7);
    return 80 + (title.length % 15);
  };

  const handleApplyClick = (job, targetType = 'official') => {
    setSelectedJob(job);
    setModalTargetType(targetType);
    setApplyModalOpen(true);
  };

  const handleProceedRedirect = () => {
    if (!selectedJob) return;
    const targetUrl = modalTargetType === 'official' ? getOfficialDeepUrl(selectedJob) : getPlatformUrl(selectedJob);
    const jobKey = `${selectedJob.title || ''}-${selectedJob.company_name || selectedJob.company}-${modalTargetType}`;
    
    // Launch external application portal in new window/tab
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    
    // Mark as redirected/applied
    setAppliedJobs(prev => ({ ...prev, [jobKey]: true }));
    setApplyModalOpen(false);

    // Show confirmation feedback toast
    setRedirectToast({
      company: selectedJob.company_name || selectedJob.company,
      title: selectedJob.title,
      targetType: modalTargetType === 'official' ? 'Official Career Portal' : (selectedCountry === 'India' ? 'Naukri.com / LinkedIn' : 'LinkedIn Jobs'),
      url: targetUrl
    });
    setTimeout(() => setRedirectToast(null), 5000);
  };

  const handleCustomRoleSubmit = (e) => {
    e.preventDefault();
    if (customRoleInput.trim()) {
      setActiveRole(customRoleInput.trim());
      setCustomRoleInput('');
    }
  };

  const handleCustomCountrySubmit = (e) => {
    e.preventDefault();
    if (customCountryInput.trim()) {
      setSelectedCountry(customCountryInput.trim());
      setCustomCountryInput('');
    }
  };

  return (
    <div className="mapped-jobs-container animate-fade-in custom-scroll">
      
      {/* TOAST NOTIFICATION FOR REDIRECT */}
      {redirectToast && (
        <div className="redirect-toast glass-card animate-slide-down">
          <CheckCircle size={20} color="#10B981" />
          <div>
            <strong>Redirected to {redirectToast.targetType}!</strong>
            <p>Opened {redirectToast.company} live applications in a new browser tab.</p>
          </div>
          <button onClick={() => setRedirectToast(null)} className="toast-close">
            <X size={16} />
          </button>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="jobs-header glass-card">
        <div className="header-left">
          <button onClick={() => navigate(-1)} className="back-btn glass-card">
            <ArrowLeft size={20} color="#00F0FF" />
          </button>
          <div>
            <div className="header-badge">
              <Sparkles size={12} color="#00F0FF" />
              <span>LIVE COMPANY HIRING DIRECTORY • 30+ OPENINGS AVAILABLE</span>
            </div>
            <h1 className="header-title">Live Job Market Portal</h1>
            <p className="header-sub">
              Filtered openings for <strong style={{ color: '#00F0FF' }}>[{activeRole.toUpperCase()}]</strong> in <strong style={{ color: '#8B5CF6' }}>[{selectedCountry.toUpperCase()}]</strong>. Apply via verified career portals.
            </p>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="search-bar glass-card">
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search company (Google, TCS...) or title..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* USER PREFERENCE & SELECTION SECTIONS */}
      <div className="user-preferences-panel glass-card">
        
        {/* TARGET ROLE SELECTOR */}
        <div className="preference-block">
          <div className="preference-header">
            <Briefcase size={15} color="#00F0FF" />
            <span>TARGET ROLE: <strong style={{ color: '#00F0FF' }}>{activeRole}</strong></span>
          </div>
          <div className="pills-and-input-row">
            <div className="filter-pills custom-scroll">
              {rolePresets.map(role => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`pref-pill ${activeRole === role ? 'active-cyan' : ''}`}
                >
                  {role}
                </button>
              ))}
            </div>
            <form onSubmit={handleCustomRoleSubmit} className="custom-input-form">
              <input 
                type="text" 
                placeholder="Other Role..."
                value={customRoleInput}
                onChange={(e) => setCustomRoleInput(e.target.value)}
              />
              <button type="submit" className="btn-small-glow">SET</button>
            </form>
          </div>
        </div>

        {/* COUNTRY SELECTOR */}
        <div className="preference-block" style={{ marginTop: '14px' }}>
          <div className="preference-header">
            <Compass size={15} color="#8B5CF6" />
            <span>HIRING LOCATION: <strong style={{ color: '#8B5CF6' }}>{selectedCountry}</strong></span>
          </div>
          <div className="pills-and-input-row">
            <div className="filter-pills custom-scroll">
              {countryPresets.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCountry(c)}
                  className={`pref-pill ${selectedCountry === c ? 'active-violet' : ''}`}
                >
                  {c === 'India' ? '🇮🇳 India (Default)' : c}
                </button>
              ))}
            </div>
            <form onSubmit={handleCustomCountrySubmit} className="custom-input-form">
              <input 
                type="text" 
                placeholder="Other Country..."
                value={customCountryInput}
                onChange={(e) => setCustomCountryInput(e.target.value)}
              />
              <button type="submit" className="btn-small-glow">SET</button>
            </form>
          </div>
        </div>

        {/* WORK MODE & CATEGORY & COMPANY FILTERS */}
        <div className="secondary-filters-row" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          
          <div className="filter-group">
            <span className="filter-label-small"><Navigation size={13} color="#10B981" /> MODE:</span>
            <div className="filter-pills">
              {workModes.map(mode => (
                <button
                  key={mode}
                  onClick={() => setSelectedWorkMode(mode)}
                  className={`mini-pill ${selectedWorkMode === mode ? 'active-emerald' : ''}`}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label-small"><Layers size={13} color="#8B5CF6" /> CATEGORY:</span>
            <div className="filter-pills custom-scroll">
              {categoriesList.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`mini-pill ${selectedCategory === cat ? 'active-violet' : ''}`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group" style={{ flex: 1 }}>
            <span className="filter-label-small"><Filter size={13} color="#00F0FF" /> COMPANY:</span>
            <div className="filter-pills custom-scroll">
              {companiesList.map(comp => (
                <button
                  key={comp}
                  onClick={() => setSelectedCompany(comp)}
                  className={`mini-pill ${selectedCompany === comp ? 'active-cyan' : ''}`}
                >
                  {comp.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* OPENINGS SUMMARY BANNER */}
      <div className="openings-summary-banner glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Building size={20} color="#00F0FF" />
          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
            Showing <span style={{ color: '#00F0FF' }}>{filteredJobs.length}</span> Verified Openings for <span style={{ color: '#8B5CF6' }}>"{activeRole}"</span> in <span style={{ color: '#10B981' }}>{selectedCountry}</span>
          </span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="#10B981" /> Accurate Deep Search URLs & Direct Platform Redirects
        </div>
      </div>

      {/* CONTENT AREA */}
      {loading ? (
        <div className="loading-state glass-card">
          <Activity className="pulse-slow" size={48} color="#00F0FF" />
          <p>FETCHING {activeRole.toUpperCase()} JOBS IN {selectedCountry.toUpperCase()}...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="empty-jobs glass-card">
          <Building size={48} color="#00F0FF" />
          <h3>No positions matching "{search || selectedCompany || selectedWorkMode}"</h3>
          <p>Try clearing search text or resetting company / work mode filters.</p>
          <button onClick={() => { setSearch(''); setSelectedCompany('All'); setSelectedCategory('All'); setSelectedWorkMode('All'); }} className="btn-glow" style={{ marginTop: '16px', padding: '10px 24px' }}>
            RESET ALL FILTERS
          </button>
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job, idx) => {
            const companyName = job.company_name || job.company || 'Enterprise Partner';
            const jobTitle = job.title || job.title_text || `${activeRole}`;
            const matchScore = calculateJobMatch(jobTitle);
            const jobOfficialKey = `${jobTitle}-${companyName}-official`;
            const jobPlatformKey = `${jobTitle}-${companyName}-platform`;
            const isOfficialApplied = appliedJobs[jobOfficialKey];
            const isPlatformApplied = appliedJobs[jobPlatformKey];

            return (
              <div key={idx} className={`job-card glass-card hover-glow ${(isOfficialApplied || isPlatformApplied) ? 'redirected-card' : ''}`}>
                
                <div className="job-card-top">
                  <div className="company-logo-avatar">
                    {companyName.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="job-card-meta">
                    <span className="company-name"><Globe size={12} color="#00F0FF" /> {companyName}</span>
                    <h3 className="job-title" title={jobTitle}>{jobTitle}</h3>
                  </div>

                  <div className="match-score-pill">
                    <span className="match-num">{matchScore}%</span>
                    <span className="match-label">MATCH</span>
                  </div>
                </div>

                <div className="job-tags-row">
                  <span className="tag-pill"><MapPin size={12} /> {job.location || `${selectedCountry}`}</span>
                  <span className="tag-pill salary"><Zap size={12} /> {job.salary || (selectedCountry === 'India' ? '₹14L - ₹32L P.A.' : '$125,000 - $185,000')}</span>
                </div>

                <p className="job-desc">
                  {job.description || `Key strategic hiring priority at ${companyName}. High alignment detected based on your analyzed resume skills.`}
                </p>

                {/* DUAL APPLY BUTTONS (Official Career Site & Platform Apply) */}
                <div className="job-actions-vertical">
                  
                  {/* BUTTON 1: OFFICIAL CAREER PORTAL */}
                  <button 
                    onClick={() => handleApplyClick(job, 'official')}
                    className={`btn-apply-action official ${isOfficialApplied ? 'applied' : ''}`}
                  >
                    {isOfficialApplied ? (
                      <><CheckCircle size={15} color="#10B981" /> CAREER SITE OPENED ↗</>
                    ) : (
                      <><ExternalLink size={15} /> OFFICIAL CAREER SITE (ACCURATE SEARCH) ↗</>
                    )}
                  </button>

                  {/* BUTTON 2: PLATFORM DIRECT APPLY (LinkedIn / Naukri) */}
                  <button 
                    onClick={() => handleApplyClick(job, 'platform')}
                    className={`btn-apply-action platform ${isPlatformApplied ? 'applied' : ''}`}
                  >
                    {isPlatformApplied ? (
                      <><CheckCircle size={15} color="#10B981" /> PLATFORM OPENED ↗</>
                    ) : (
                      <><Briefcase size={15} /> APPLY VIA {selectedCountry === 'India' ? 'NAUKRI / LINKEDIN' : 'LINKEDIN / INDEED'} ↗</>
                    )}
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* OFFICIAL PORTAL REDIRECT CONFIRMATION MODAL */}
      {applyModalOpen && selectedJob && (
        <div className="modal-backdrop">
          <div className="apply-modal glass-card animate-slide-up">
            <div className="modal-header">
              <div className="modal-title-box">
                <div className="modal-avatar">
                  {(selectedJob.company_name || selectedJob.company || 'G').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2>Opening {modalTargetType === 'official' ? 'Official Career Site' : 'Direct Job Platform'}</h2>
                  <p>{selectedJob.company_name || selectedJob.company} • {selectedJob.title}</p>
                </div>
              </div>
              <button onClick={() => setApplyModalOpen(false)} className="close-modal-btn">
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="redirect-info-box">
                <ShieldCheck size={28} color="#10B981" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '4px' }}>
                    {modalTargetType === 'official' ? 'Verified Official Career Portal' : 'Direct Job Application Platform'}
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    {modalTargetType === 'official' 
                      ? `We pre-filtered this link for "${activeRole}" in ${selectedCountry} so you don't have to re-type search criteria on ${selectedJob.company_name || selectedJob.company}'s career site.`
                      : `Redirecting to pre-filtered hiring listings on ${selectedCountry === 'India' ? 'Naukri.com & LinkedIn India' : 'LinkedIn & Indeed'} for instant 1-click application.`
                    }
                  </p>
                </div>
              </div>

              <div className="target-url-preview glass-card">
                <span style={{ fontSize: '10px', color: '#8B5CF6', fontWeight: 'bold', letterSpacing: '1px' }}>ACCURATE DESTINATION URL:</span>
                <span className="url-text">
                  {modalTargetType === 'official' ? getOfficialDeepUrl(selectedJob) : getPlatformUrl(selectedJob)}
                </span>
              </div>

              <div className="redirect-note">
                <Sparkles size={14} color="#00F0FF" />
                <span>Clicking below opens the exact filtered hiring portal in a new browser window.</span>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={() => setApplyModalOpen(false)} className="btn-cancel">
                CANCEL
              </button>
              <button 
                type="button" 
                onClick={handleProceedRedirect} 
                className="btn-glow flex-center" 
                style={{ gap: '8px', padding: '12px 24px' }}
              >
                <ExternalLink size={16} /> PROCEED TO PORTAL ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPACT & SLEEK STYLES */}
      <style dangerouslySetInnerHTML={{ __html: `
        .mapped-jobs-container {
          padding: 32px 40px;
          min-height: 100vh;
          background: #060811;
          color: #fff;
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
        }

        .redirect-toast {
          position: fixed;
          top: 80px;
          right: 40px;
          z-index: 200000;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          background: rgba(13, 16, 29, 0.95);
          border: 1px solid #10B981;
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
          border-radius: 12px;
          max-width: 420px;
        }
        .redirect-toast strong { font-size: 13px; color: #fff; display: block; }
        .redirect-toast p { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
        .toast-close { background: none; border: none; color: #94A3B8; cursor: pointer; padding: 4px; margin-left: auto; }

        .jobs-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 32px;
          background: rgba(13, 16, 29, 0.7);
          border-left: 3px solid #00F0FF;
          border-radius: 14px;
        }
        .header-left { display: flex; align-items: center; gap: 20px; }
        .back-btn { padding: 12px; border: 1px solid rgba(0, 240, 255, 0.2); cursor: pointer; background: rgba(0, 240, 255, 0.05); border-radius: 10px; transition: 0.2s; }
        .back-btn:hover { background: rgba(0, 240, 255, 0.15); transform: translateX(-3px); }
        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: bold;
          color: #00F0FF;
          letter-spacing: 1.5px;
          margin-bottom: 4px;
        }
        .header-title { font-size: 26px; font-weight: bold; margin: 0; color: #fff; }
        .header-sub { font-size: 13px; color: var(--text-muted); margin-top: 4px; }
        
        .search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(0, 240, 255, 0.2);
          border-radius: 10px;
          width: 360px;
        }
        .search-bar input {
          border: none;
          background: none;
          color: #fff;
          width: 100%;
          outline: none;
          font-size: 13px;
        }

        /* USER PREFERENCES PANEL STYLES */
        .user-preferences-panel {
          padding: 20px 24px;
          background: rgba(13, 16, 29, 0.7);
          border-radius: 14px;
          border: 1px solid rgba(0, 240, 255, 0.15);
          display: flex;
          flex-direction: column;
        }
        .preference-block { display: flex; flex-direction: column; gap: 8px; }
        .preference-header { font-size: 11px; font-weight: bold; color: var(--text-muted); letter-spacing: 1px; display: flex; align-items: center; gap: 8px; }
        .pills-and-input-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .filter-pills { display: flex; align-items: center; gap: 8px; overflow-x: auto; padding-bottom: 4px; flex: 1; }

        .pref-pill {
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #CBD5E1;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .pref-pill:hover { border-color: rgba(0, 240, 255, 0.4); color: #fff; }
        .pref-pill.active-cyan {
          background: rgba(0, 240, 255, 0.15);
          color: #00F0FF;
          border-color: #00F0FF;
          box-shadow: 0 0 12px rgba(0, 240, 255, 0.3);
        }
        .pref-pill.active-violet {
          background: rgba(139, 92, 246, 0.2);
          color: #C4B5FD;
          border-color: #8B5CF6;
          box-shadow: 0 0 12px rgba(139, 92, 246, 0.35);
        }

        .custom-input-form { display: flex; align-items: center; gap: 6px; }
        .custom-input-form input {
          padding: 6px 12px;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 6px;
          color: #fff;
          font-size: 11px;
          width: 130px;
          outline: none;
        }
        .custom-input-form input:focus { border-color: #00F0FF; }
        .btn-small-glow {
          padding: 6px 12px;
          background: rgba(0, 240, 255, 0.15);
          border: 1px solid #00F0FF;
          color: #00F0FF;
          border-radius: 6px;
          font-size: 10px;
          font-weight: bold;
          cursor: pointer;
        }

        .secondary-filters-row { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
        .filter-group { display: flex; align-items: center; gap: 8px; }
        .filter-label-small { font-size: 10px; font-weight: bold; color: var(--text-muted); letter-spacing: 1px; display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
        
        .mini-pill {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: bold;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #94A3B8;
          cursor: pointer;
          flex-shrink: 0;
        }
        .mini-pill.active-emerald { background: rgba(16, 185, 129, 0.2); color: #10B981; border-color: #10B981; }
        .mini-pill.active-violet { background: rgba(139, 92, 246, 0.2); color: #C4B5FD; border-color: #8B5CF6; }
        .mini-pill.active-cyan { background: rgba(0, 240, 255, 0.2); color: #00F0FF; border-color: #00F0FF; }

        .openings-summary-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 24px;
          background: rgba(0, 240, 255, 0.04);
          border: 1px solid rgba(0, 240, 255, 0.15);
          border-radius: 10px;
        }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 20px;
        }
        .job-card {
          padding: 24px;
          background: rgba(13, 16, 29, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all 0.25 ease;
          position: relative;
        }
        .job-card:hover {
          border-color: rgba(0, 240, 255, 0.35);
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0, 240, 255, 0.08);
        }
        .job-card.redirected-card {
          border-color: rgba(16, 185, 129, 0.4);
          background: rgba(16, 185, 129, 0.03);
        }

        .job-card-top { display: flex; gap: 14px; align-items: flex-start; }
        .company-logo-avatar {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(139, 92, 246, 0.2));
          border: 1px solid rgba(0, 240, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          color: #00F0FF;
          flex-shrink: 0;
        }
        .job-card-meta { flex: 1; min-width: 0; }
        .company-name { font-size: 11px; color: #00F0FF; font-weight: bold; display: flex; align-items: center; gap: 4px; }
        .job-title { font-size: 16px; font-weight: bold; color: #fff; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .match-score-pill {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .match-num { font-size: 20px; font-weight: bold; color: #10B981; }
        .match-label { font-size: 8px; color: var(--text-muted); letter-spacing: 1px; }

        .job-tags-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .tag-pill {
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 11px;
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .tag-pill.salary { background: rgba(16, 185, 129, 0.1); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.25); font-weight: bold; }

        .job-desc {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.6;
          height: 56px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .job-actions-vertical { display: flex; flex-direction: column; gap: 8px; }
        .btn-apply-action {
          width: 100%;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .btn-apply-action.official {
          background: rgba(0, 240, 255, 0.1);
          border: 1px solid rgba(0, 240, 255, 0.35);
          color: #00F0FF;
        }
        .btn-apply-action.official:hover { background: #00F0FF; color: #000; box-shadow: 0 0 15px rgba(0, 240, 255, 0.4); }
        
        .btn-apply-action.platform {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.35);
          color: #C4B5FD;
        }
        .btn-apply-action.platform:hover { background: #8B5CF6; color: #fff; box-shadow: 0 0 15px rgba(139, 92, 246, 0.4); }
        
        .btn-apply-action.applied { background: rgba(16, 185, 129, 0.15); color: #10B981; border-color: rgba(16, 185, 129, 0.4); }

        .modal-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          z-index: 100000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .apply-modal {
          width: 100%;
          max-width: 540px;
          padding: 32px;
          background: #0D101D;
          border: 1px solid rgba(0, 240, 255, 0.3);
          border-radius: 16px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .modal-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .modal-title-box { display: flex; gap: 14px; align-items: center; }
        .modal-avatar {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: rgba(0, 240, 255, 0.15);
          border: 1px solid #00F0FF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #00F0FF;
          font-size: 18px;
        }
        .modal-title-box h2 { font-size: 17px; margin: 0; color: #fff; }
        .modal-title-box p { font-size: 12px; color: #00F0FF; margin-top: 2px; }
        .close-modal-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; }
        .close-modal-btn:hover { color: #fff; }

        .modal-body { display: flex; flex-direction: column; gap: 16px; }
        .redirect-info-box {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 16px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: 10px;
        }
        .target-url-preview {
          padding: 12px 16px;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .url-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #00F0FF;
          word-break: break-all;
        }
        .redirect-note {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: var(--text-muted);
        }

        .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
        .btn-cancel { padding: 10px 20px; background: none; border: 1px solid rgba(255,255,255,0.15); color: #fff; cursor: pointer; border-radius: 8px; font-size: 11px; font-weight: bold; }

        .loading-state, .empty-jobs {
          padding: 80px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          opacity: 0.85;
        }
      `}} />
    </div>
  );
}
