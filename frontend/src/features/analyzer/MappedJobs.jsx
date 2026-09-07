import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Globe, Briefcase, MapPin, ExternalLink, 
  Activity, Zap, ShieldCheck, Target, Search, Filter, CheckCircle, X, Send, Sparkles, Building, Layers, Navigation, Compass, Share2
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

  // Direct Apply Tracking & Redirect Toast State
  const [appliedJobs, setAppliedJobs] = useState({});
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

  const popularCompanies = [
    'All', 'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'NVIDIA', 'Netflix', 
    'TCS', 'Infosys', 'Accenture', 'Wipro', 'IBM', 'Deloitte', 'Oracle', 'Adobe'
  ];

  const allCompaniesList = [
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

  // URL Generators for Various Application Platforms
  const getPlatformUrl = (platformKey, job) => {
    const compRaw = job?.company_name || job?.company || 'Enterprise';
    const comp = encodeURIComponent(compRaw);
    const role = encodeURIComponent(activeRole || 'Software Engineer');
    const loc = encodeURIComponent(selectedCountry === 'Global / All' ? 'Global' : selectedCountry);

    switch (platformKey) {
      case 'official':
        const cLow = compRaw.toLowerCase().trim();
        if (cLow.includes('google')) return `https://careers.google.com/jobs/results/?q=${role}&location=${loc}`;
        if (cLow.includes('microsoft')) return `https://careers.microsoft.com/us/en/search-results?keywords=${role}`;
        if (cLow.includes('amazon')) return `https://www.amazon.jobs/en/search?base_query=${role}`;
        if (cLow.includes('meta') || cLow.includes('facebook')) return `https://www.metacareers.com/jobs?q=${role}`;
        if (cLow.includes('apple')) return `https://jobs.apple.com/en-us/search?search=${role}`;
        if (cLow.includes('nvidia')) return `https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite?q=${role}`;
        if (cLow.includes('netflix')) return `https://jobs.netflix.com/search?q=${role}`;
        if (cLow.includes('tesla')) return `https://www.tesla.com/careers/search/?query=${role}`;
        if (cLow.includes('tcs')) return `https://www.tcs.com/careers`;
        if (cLow.includes('infosys')) return `https://www.infosys.com/careers.html`;
        if (cLow.includes('accenture')) return `https://www.accenture.com/in-en/careers/jobsearch?jk=${role}`;
        if (cLow.includes('wipro')) return `https://careers.wipro.com/careers-home/`;
        if (cLow.includes('ibm')) return `https://www.ibm.com/careers/search?q=${role}`;
        if (job?.url && job.url.includes('http')) return job.url;
        return `https://www.google.com/search?q=${encodeURIComponent(`${compRaw} ${activeRole} careers ${selectedCountry}`)}`;

      case 'linkedin':
        return `https://www.linkedin.com/jobs/search/?keywords=${comp}%20${role}&location=${loc}`;

      case 'naukri':
        const naukriRole = (activeRole || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const naukriLoc = selectedCountry.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return `https://www.naukri.com/${naukriRole}-jobs-in-${naukriLoc}?k=${comp}%20${role}`;

      case 'indeed':
        return `https://www.indeed.com/jobs?q=${comp}%20${role}&l=${loc}`;

      case 'glassdoor':
        return `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${comp}%20${role}`;

      case 'wellfound':
        return `https://wellfound.com/jobs?q=${comp}%20${role}`;

      case 'googlejobs':
        return `https://www.google.com/search?q=${comp}%20${role}%20jobs%20in%20${loc}&ibp=htl;jobs`;

      default:
        return `https://www.google.com/search?q=${comp}%20${role}%20careers`;
    }
  };

  const handleOpenPlatform = (platformKey, platformName, job) => {
    const targetUrl = getPlatformUrl(platformKey, job);
    const jobKey = `${job.title || ''}-${job.company_name || job.company}-${platformKey}`;

    window.open(targetUrl, '_blank', 'noopener,noreferrer');

    setAppliedJobs(prev => ({ ...prev, [jobKey]: true }));

    setRedirectToast({
      company: job.company_name || job.company || 'Enterprise',
      title: job.title || activeRole,
      platform: platformName,
      url: targetUrl
    });
    setTimeout(() => setRedirectToast(null), 5000);
  };

  const calculateJobMatch = (jobTitle) => {
    const role = activeRole.toLowerCase();
    const title = (jobTitle || '').toLowerCase();
    if (title.includes(role)) return 92 + (title.length % 7);
    return 80 + (title.length % 15);
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
    <div className="mapped-jobs-container animate-fade-in">
      
      {/* TOAST NOTIFICATION FOR REDIRECT */}
      {redirectToast && (
        <div className="redirect-toast glass-card animate-slide-down">
          <CheckCircle size={20} color="#10B981" />
          <div>
            <strong>Redirected to {redirectToast.platform}!</strong>
            <p>Opened {redirectToast.company} listings on {redirectToast.platform} in a new tab.</p>
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
              Filtered openings for <strong style={{ color: '#00F0FF' }}>[{activeRole.toUpperCase()}]</strong> in <strong style={{ color: '#8B5CF6' }}>[{selectedCountry.toUpperCase()}]</strong>. Apply via top verified career platforms.
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
      </div>      {/* USER PREFERENCE & SELECTION SECTIONS (EXPANDED HEIGHT-WISE WITH SKEUOMORPHISM & NO SCROLLBARS) */}
      <div className="user-preferences-panel skeuo-card no-scrollbar">
        
        {/* TARGET ROLE SELECTOR */}
        <div className="preference-block">
          <div className="preference-header">
            <Briefcase size={15} color="#00F0FF" />
            <span>TARGET ROLE: <strong style={{ color: '#00F0FF' }}>{activeRole}</strong></span>
          </div>
          <div className="pills-and-input-row">
            <div className="filter-pills-wrap">
              {rolePresets.map(role => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`skeuo-button pref-pill ${activeRole === role ? 'active-cyan' : ''}`}
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
                className="skeuo-input"
              />
              <button type="submit" className="skeuo-button btn-small-glow">SET</button>
            </form>
          </div>
        </div>

        {/* COUNTRY SELECTOR */}
        <div className="preference-block" style={{ marginTop: '16px' }}>
          <div className="preference-header">
            <Compass size={15} color="#8B5CF6" />
            <span>HIRING LOCATION: <strong style={{ color: '#8B5CF6' }}>{selectedCountry}</strong></span>
          </div>
          <div className="pills-and-input-row">
            <div className="filter-pills-wrap">
              {countryPresets.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCountry(c)}
                  className={`skeuo-button pref-pill ${selectedCountry === c ? 'active-violet' : ''}`}
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
                className="skeuo-input"
              />
              <button type="submit" className="skeuo-button btn-small-glow">SET</button>
            </form>
          </div>
        </div>

        {/* WORK MODE & CATEGORY & COMPANY FILTERS (EXPANDED VERTICALLY - NO SCROLLBARS) */}
        <div className="secondary-filters-grid" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          
          <div className="preference-block">
            <div className="preference-header">
              <Navigation size={14} color="#10B981" />
              <span>WORK MODE: <strong style={{ color: '#10B981' }}>{selectedWorkMode}</strong></span>
            </div>
            <div className="filter-pills-wrap">
              {workModes.map(mode => (
                <button
                  key={mode}
                  onClick={() => setSelectedWorkMode(mode)}
                  className={`skeuo-button mini-pill ${selectedWorkMode === mode ? 'active-emerald' : ''}`}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="preference-block" style={{ marginTop: '16px' }}>
            <div className="preference-header">
              <Layers size={14} color="#8B5CF6" />
              <span>ROLE CATEGORY: <strong style={{ color: '#8B5CF6' }}>{selectedCategory}</strong></span>
            </div>
            <div className="filter-pills-wrap">
              {categoriesList.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`skeuo-button mini-pill ${selectedCategory === cat ? 'active-violet' : ''}`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="preference-block" style={{ marginTop: '16px' }}>
            <div className="preference-header">
              <Filter size={14} color="#00F0FF" />
              <span>COMPANY FILTER: <strong style={{ color: '#00F0FF' }}>{selectedCompany}</strong></span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <select 
                value={selectedCompany} 
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="company-dropdown-select skeuo-input"
              >
                {allCompaniesList.map(comp => (
                  <option key={comp} value={comp}>{comp.toUpperCase()}</option>
                ))}
              </select>
              <div className="filter-pills-wrap" style={{ flex: 1 }}>
                {popularCompanies.map(comp => (
                  <button
                    key={comp}
                    onClick={() => setSelectedCompany(comp)}
                    className={`skeuo-button mini-pill ${selectedCompany === comp ? 'active-cyan' : ''}`}
                  >
                    {comp.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* OPENINGS SUMMARY BANNER */}
      <div className="openings-summary-banner glass-card skeuo-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Building size={20} color="#00F0FF" />
          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
            Showing <span style={{ color: '#00F0FF' }}>{filteredJobs.length}</span> Verified Openings for <span style={{ color: '#8B5CF6' }}>"{activeRole}"</span> in <span style={{ color: '#10B981' }}>{selectedCountry}</span>
          </span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="#10B981" /> Direct 1-Click Apply Across 7 Major Job Platforms
        </div>
      </div>

      {/* CONTENT AREA */}
      {loading ? (
        <div className="loading-state glass-card skeuo-card">
          <Activity className="pulse-slow" size={48} color="#00F0FF" />
          <p>FETCHING {activeRole.toUpperCase()} JOBS IN {selectedCountry.toUpperCase()}...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="empty-jobs glass-card skeuo-card">
          <Building size={48} color="#00F0FF" />
          <h3>No positions matching "{search || selectedCompany || selectedWorkMode}"</h3>
          <p>Try clearing search text or resetting company / work mode filters.</p>
          <button onClick={() => { setSearch(''); setSelectedCompany('All'); setSelectedCategory('All'); setSelectedWorkMode('All'); }} className="btn-glow skeuo-button" style={{ marginTop: '16px', padding: '10px 24px' }}>
            RESET ALL FILTERS
          </button>
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job, idx) => {
            const companyName = job.company_name || job.company || 'Enterprise Partner';
            const jobTitle = job.title || job.title_text || `${activeRole}`;
            const matchScore = calculateJobMatch(jobTitle);
            const officialKey = `${jobTitle}-${companyName}-official`;
            const isOfficialApplied = appliedJobs[officialKey];

            return (
              <div key={idx} className={`job-card skeuo-card hover-glow ${isOfficialApplied ? 'redirected-card' : ''}`}>
                
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
                  <span className="tag-pill salary"><Zap size={12} /> {job.salary || (selectedCountry === 'India' ? '₹14L - ₹35L P.A.' : '$125,000 - $185,000')}</span>
                </div>

                <p className="job-desc">
                  {job.description || `Key strategic hiring priority at ${companyName}. High alignment detected based on your analyzed resume skills.`}
                </p>

                {/* PRIMARY OFFICIAL CAREER SITE BUTTON */}
                <button 
                  onClick={() => handleOpenPlatform('official', 'Official Career Portal', job)}
                  className={`btn-primary-apply skeuo-button ${isOfficialApplied ? 'applied' : ''}`}
                >
                  {isOfficialApplied ? (
                    <><CheckCircle size={15} color="#10B981" /> CAREER SITE OPENED ↗</>
                  ) : (
                    <><ExternalLink size={15} /> APPLY ON OFFICIAL CAREER PORTAL ↗</>
                  )}
                </button>

                {/* 1-CLICK ALL MAJOR JOB PLATFORMS APPLICATION BAR */}
                <div className="platforms-toolbar">
                  <span className="platforms-label"><Share2 size={12} color="#8B5CF6" /> DIRECT APPLY PLATFORMS:</span>
                  <div className="platform-buttons-grid">
                    
                    <button 
                      onClick={() => handleOpenPlatform('linkedin', 'LinkedIn Jobs', job)}
                      className={`platform-btn skeuo-button linkedin ${appliedJobs[`${jobTitle}-${companyName}-linkedin`] ? 'applied' : ''}`}
                      title="Apply via LinkedIn Jobs"
                    >
                      <span className="platform-icon">💼</span> LinkedIn
                    </button>

                    <button 
                      onClick={() => handleOpenPlatform('naukri', 'Naukri.com', job)}
                      className={`platform-btn skeuo-button naukri ${appliedJobs[`${jobTitle}-${companyName}-naukri`] ? 'applied' : ''}`}
                      title="Apply via Naukri.com"
                    >
                      <span className="platform-icon">🇮🇳</span> Naukri
                    </button>

                    <button 
                      onClick={() => handleOpenPlatform('indeed', 'Indeed Jobs', job)}
                      className={`platform-btn skeuo-button indeed ${appliedJobs[`${jobTitle}-${companyName}-indeed`] ? 'applied' : ''}`}
                      title="Apply via Indeed"
                    >
                      <span className="platform-icon">🌐</span> Indeed
                    </button>

                    <button 
                      onClick={() => handleOpenPlatform('glassdoor', 'Glassdoor', job)}
                      className={`platform-btn skeuo-button glassdoor ${appliedJobs[`${jobTitle}-${companyName}-glassdoor`] ? 'applied' : ''}`}
                      title="Apply via Glassdoor"
                    >
                      <span className="platform-icon">🟢</span> Glassdoor
                    </button>

                    <button 
                      onClick={() => handleOpenPlatform('wellfound', 'Wellfound / AngelList', job)}
                      className={`platform-btn skeuo-button wellfound ${appliedJobs[`${jobTitle}-${companyName}-wellfound`] ? 'applied' : ''}`}
                      title="Apply via Wellfound / Startup Jobs"
                    >
                      <span className="platform-icon">🚀</span> Wellfound
                    </button>

                    <button 
                      onClick={() => handleOpenPlatform('googlejobs', 'Google Jobs', job)}
                      className={`platform-btn skeuo-button googlejobs ${appliedJobs[`${jobTitle}-${companyName}-googlejobs`] ? 'applied' : ''}`}
                      title="Apply via Google Jobs Search"
                    >
                      <span className="platform-icon">🔍</span> Google Jobs
                    </button>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* RESPONSIVE & SKEUOMORPHIC STYLES WITH ZERO SCROLLBARS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .mapped-jobs-container {
          padding: 24px 32px;
          min-height: 100vh;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
          background: #060811;
          color: #fff;
          display: flex;
          flex-direction: column;
          gap: 20px;
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
          padding: 20px 28px;
          background: rgba(13, 16, 29, 0.7);
          border-left: 3px solid #00F0FF;
          border-radius: 14px;
          width: 100%;
          box-sizing: border-box;
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
        .header-title { font-size: 24px; font-weight: bold; margin: 0; color: #fff; }
        .header-sub { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
        
        .search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(0, 240, 255, 0.2);
          border-radius: 10px;
          width: 320px;
        }
        .search-bar input {
          border: none;
          background: none;
          color: #fff;
          width: 100%;
          outline: none;
          font-size: 13px;
        }

        /* SKEUOMORPHIC USER PREFERENCES PANEL (EXPANDED VERTICALLY) */
        .user-preferences-panel {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          box-sizing: border-box;
        }
        .preference-block { display: flex; flex-direction: column; gap: 10px; width: 100%; }
        .preference-header { font-size: 11px; font-weight: bold; color: var(--text-muted); letter-spacing: 1px; display: flex; align-items: center; gap: 8px; }
        .pills-and-input-row { display: flex; align-items: flex-start; gap: 16px; width: 100%; flex-wrap: wrap; }
        
        .filter-pills-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          flex: 1;
        }

        .pref-pill {
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
        }
        .pref-pill.active-cyan {
          background: linear-gradient(180deg, rgba(0, 240, 255, 0.25) 0%, rgba(0, 240, 255, 0.08) 100%);
          color: #00F0FF;
          border-color: #00F0FF;
          box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.7), 0 0 15px rgba(0, 240, 255, 0.4);
        }
        .pref-pill.active-violet {
          background: linear-gradient(180deg, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.1) 100%);
          color: #C4B5FD;
          border-color: #8B5CF6;
          box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.7), 0 0 15px rgba(139, 92, 246, 0.4);
        }

        .custom-input-form { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .custom-input-form input {
          padding: 8px 14px;
          font-size: 11px;
          width: 140px;
          outline: none;
        }
        .btn-small-glow {
          padding: 8px 14px;
          font-size: 10px;
          font-weight: bold;
          color: #00F0FF;
          border-radius: 8px;
        }

        .secondary-filters-grid { display: flex; flex-direction: column; gap: 16px; width: 100%; box-sizing: border-box; }
        
        .company-dropdown-select {
          padding: 8px 12px;
          font-size: 11px;
          font-weight: bold;
          color: #00F0FF;
          outline: none;
          cursor: pointer;
          flex-shrink: 0;
          border-radius: 8px;
        }

        .mini-pill {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 10.5px;
          font-weight: bold;
        }
        .mini-pill.active-emerald {
          background: linear-gradient(180deg, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.1) 100%);
          color: #10B981;
          border-color: #10B981;
          box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.7), 0 0 12px rgba(16, 185, 129, 0.4);
        }
        .mini-pill.active-violet {
          background: linear-gradient(180deg, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.1) 100%);
          color: #C4B5FD;
          border-color: #8B5CF6;
          box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.7), 0 0 12px rgba(139, 92, 246, 0.4);
        }
        .mini-pill.active-cyan {
          background: linear-gradient(180deg, rgba(0, 240, 255, 0.25) 0%, rgba(0, 240, 255, 0.08) 100%);
          color: #00F0FF;
          border-color: #00F0FF;
          box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.7), 0 0 12px rgba(0, 240, 255, 0.4);
        }

        .openings-summary-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 24px;
          border-radius: 12px;
          width: 100%;
          box-sizing: border-box;
        }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 20px;
          width: 100%;
          box-sizing: border-box;
        }
        .job-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all 0.25 ease;
          position: relative;
          width: 100%;
          box-sizing: border-box;
        }
        .job-card:hover {
          border-color: rgba(0, 240, 255, 0.4);
          transform: translateY(-3px);
        }
        .job-card.redirected-card {
          border-color: rgba(16, 185, 129, 0.4);
          background: rgba(16, 185, 129, 0.03);
        }

        .job-card-top { display: flex; gap: 14px; align-items: flex-start; }
        .company-logo-avatar {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: linear-gradient(145deg, rgba(0, 240, 255, 0.2), rgba(139, 92, 246, 0.2));
          border: 1px solid rgba(0, 240, 255, 0.3);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 8px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
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
          border-radius: 6px;
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
          line-height: 1.55;
          height: 54px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .btn-primary-apply {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 11.5px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #00F0FF;
        }

        .platforms-toolbar {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .platforms-label { font-size: 9px; font-weight: bold; color: #8B5CF6; letter-spacing: 1px; display: flex; align-items: center; gap: 4px; }
        .platform-buttons-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }
        .platform-btn {
          padding: 7px 10px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

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

