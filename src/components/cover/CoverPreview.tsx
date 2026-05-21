import { forwardRef } from 'react';
import { CoverData } from './types';

interface Props {
  data: CoverData;
}

/**
 * Print-ready A4 cover preview. Uses inline styles (not Tailwind tokens)
 * because html2canvas needs absolute color values for reliable rasterization.
 */
const CoverPreview = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const theme = data.themeColor || '#1e3a8a';
  const fs = data.fontScale || 1;

  // A4 at 96 DPI ≈ 794 x 1123 px
  const baseStyle: React.CSSProperties = {
    width: 794,
    minHeight: 1123,
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontFamily: 'Georgia, "Times New Roman", serif',
    padding: 64,
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
  };

  const renderClassic = () => (
    <div ref={ref} style={baseStyle}>
      {/* Top border */}
      <div
        style={{
          height: 12,
          background: `linear-gradient(90deg, ${theme}, ${theme}cc)`,
          marginBottom: 32,
        }}
      />
      <div style={{ textAlign: 'center' }}>
        {data.logo && (
          <img
            src={data.logo}
            alt="Logo"
            style={{
              width: 110,
              height: 110,
              objectFit: 'contain',
              margin: '0 auto 20px',
            }}
            crossOrigin="anonymous"
          />
        )}
        <div
          style={{
            fontSize: 28 * fs,
            fontWeight: 700,
            color: theme,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          {data.university || 'University Name'}
        </div>
        <div
          style={{
            fontSize: 18 * fs,
            marginTop: 8,
            fontStyle: 'italic',
            color: '#475569',
          }}
        >
          {data.faculty || 'Faculty / Department'}
        </div>

        <div
          style={{
            margin: '60px auto',
            width: 140,
            height: 3,
            background: theme,
          }}
        />

        <div style={{ fontSize: 16 * fs, color: '#334155' }}>
          {data.courseCode || 'COURSE CODE'} —{' '}
          {data.courseName || 'Course Name'}
        </div>

        <div
          style={{
            marginTop: 70,
            fontSize: 13 * fs,
            textTransform: 'uppercase',
            letterSpacing: 4,
            color: '#64748b',
          }}
        >
          {data.category === 'group' ? 'Group Assignment' : 'Individual Assignment'}
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 34 * fs,
            fontWeight: 700,
            lineHeight: 1.3,
            color: '#0f172a',
            padding: '0 40px',
          }}
        >
          {data.assignmentTitle || 'Assignment Title Goes Here'}
        </div>
      </div>

      {/* Details block */}
      <div
        style={{
          position: 'absolute',
          left: 64,
          right: 64,
          bottom: 96,
          borderTop: `2px solid ${theme}`,
          paddingTop: 24,
          fontSize: 14 * fs,
          color: '#1e293b',
        }}
      >
        {data.category === 'individual' ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
            <div>
              <div style={{ color: '#64748b', fontSize: 11 * fs, textTransform: 'uppercase' }}>
                Submitted by
              </div>
              <div style={{ fontWeight: 600, marginTop: 4 }}>
                {data.studentName || 'Student Name'}
              </div>
              <div style={{ marginTop: 2 }}>{data.registrationNumber || 'Reg. Number'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#64748b', fontSize: 11 * fs, textTransform: 'uppercase' }}>
                Submitted to
              </div>
              <div style={{ fontWeight: 600, marginTop: 4 }}>
                {data.lecturerName || 'Lecturer Name'}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#64748b', fontSize: 11 * fs, textTransform: 'uppercase' }}>
                  Group
                </div>
                <div style={{ fontWeight: 600, marginTop: 4 }}>
                  {data.groupName || 'Group Name'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#64748b', fontSize: 11 * fs, textTransform: 'uppercase' }}>
                  Submitted to
                </div>
                <div style={{ fontWeight: 600, marginTop: 4 }}>
                  {data.lecturerName || 'Lecturer Name'}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ color: '#64748b', fontSize: 11 * fs, textTransform: 'uppercase', marginBottom: 6 }}>
                Members
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 * fs }}>
                <thead>
                  <tr style={{ background: `${theme}15` }}>
                    <th style={{ textAlign: 'left', padding: '6px 10px', width: 40 }}>#</th>
                    <th style={{ textAlign: 'left', padding: '6px 10px' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '6px 10px' }}>Reg. Number</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.members && data.members.length > 0
                    ? data.members
                    : [{ id: 'p', name: '', regNumber: '' }]
                  ).map((m, i) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '6px 10px' }}>{i + 1}</td>
                      <td style={{ padding: '6px 10px' }}>{m.name || '—'}</td>
                      <td style={{ padding: '6px 10px' }}>{m.regNumber || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 28,
            fontSize: 12 * fs,
            color: '#475569',
          }}
        >
          <span>Academic Year: {data.academicYear || '____ / ____'}</span>
          <span>Date: {data.submissionDate || '____ / ____ / ____'}</span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 12,
          background: `linear-gradient(90deg, ${theme}cc, ${theme})`,
        }}
      />
    </div>
  );

  // Modern: side accent bar
  const renderModern = () => (
    <div ref={ref} style={{ ...baseStyle, padding: 0, display: 'flex' }}>
      <div
        style={{
          width: 64,
          background: `linear-gradient(180deg, ${theme}, ${theme}99)`,
        }}
      />
      <div style={{ flex: 1, padding: 56, position: 'relative' }}>
        {data.logo && (
          <img
            src={data.logo}
            alt="Logo"
            style={{ width: 90, height: 90, objectFit: 'contain', marginBottom: 24 }}
            crossOrigin="anonymous"
          />
        )}
        <div style={{ fontSize: 12 * fs, letterSpacing: 4, color: theme, textTransform: 'uppercase' }}>
          {data.category === 'group' ? 'Group Assignment' : 'Individual Assignment'}
        </div>
        <div style={{ fontSize: 30 * fs, fontWeight: 800, color: '#0f172a', marginTop: 8 }}>
          {data.university || 'University Name'}
        </div>
        <div style={{ fontSize: 16 * fs, color: '#475569', marginTop: 4 }}>
          {data.faculty || 'Faculty / Department'}
        </div>

        <div style={{ marginTop: 80 }}>
          <div style={{ fontSize: 13 * fs, color: '#64748b', textTransform: 'uppercase', letterSpacing: 2 }}>
            {data.courseCode || 'COURSE CODE'} · {data.courseName || 'Course Name'}
          </div>
          <div
            style={{
              fontSize: 44 * fs,
              fontWeight: 800,
              color: theme,
              marginTop: 16,
              lineHeight: 1.15,
            }}
          >
            {data.assignmentTitle || 'Assignment Title'}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 56,
            right: 56,
            bottom: 56,
            fontSize: 14 * fs,
            color: '#1e293b',
          }}
        >
          {data.category === 'individual' ? (
            <div>
              <div style={{ fontWeight: 700 }}>{data.studentName || 'Student Name'}</div>
              <div>{data.registrationNumber || 'Reg. Number'}</div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{data.groupName || 'Group Name'}</div>
              {(data.members || []).map((m, i) => (
                <div key={m.id} style={{ fontSize: 13 * fs }}>
                  {i + 1}. {m.name || '—'} {m.regNumber ? `(${m.regNumber})` : ''}
                </div>
              ))}
            </div>
          )}
          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: `2px solid ${theme}`,
              display: 'flex',
              justifyContent: 'space-between',
              color: '#475569',
              fontSize: 12 * fs,
            }}
          >
            <span>Lecturer: {data.lecturerName || '—'}</span>
            <span>{data.academicYear || '—'}</span>
            <span>{data.submissionDate || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Minimal: centered, clean
  const renderMinimal = () => (
    <div ref={ref} style={baseStyle}>
      <div style={{ textAlign: 'center', marginTop: 120 }}>
        {data.logo && (
          <img
            src={data.logo}
            alt="Logo"
            style={{ width: 80, height: 80, objectFit: 'contain', margin: '0 auto 24px' }}
            crossOrigin="anonymous"
          />
        )}
        <div style={{ fontSize: 14 * fs, letterSpacing: 6, color: '#64748b', textTransform: 'uppercase' }}>
          {data.university || 'University Name'}
        </div>
        <div style={{ width: 60, height: 2, background: theme, margin: '24px auto' }} />
        <div style={{ fontSize: 13 * fs, color: '#475569' }}>
          {data.faculty || 'Faculty / Department'}
        </div>

        <div
          style={{
            marginTop: 140,
            fontSize: 40 * fs,
            fontWeight: 300,
            color: '#0f172a',
            letterSpacing: -0.5,
            padding: '0 60px',
          }}
        >
          {data.assignmentTitle || 'Assignment Title'}
        </div>
        <div style={{ marginTop: 20, fontSize: 14 * fs, color: theme, letterSpacing: 2 }}>
          {data.courseCode || 'CODE'} — {data.courseName || 'Course Name'}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 64,
          right: 64,
          bottom: 80,
          textAlign: 'center',
          fontSize: 13 * fs,
          color: '#475569',
        }}
      >
        {data.category === 'individual' ? (
          <div>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>
              {data.studentName || 'Student Name'}
            </div>
            <div>{data.registrationNumber || 'Reg. Number'}</div>
          </div>
        ) : (
          <div>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>
              {data.groupName || 'Group Name'}
            </div>
            <div style={{ marginTop: 4 }}>
              {(data.members || []).map((m) => m.name).filter(Boolean).join(' · ') || 'Members'}
            </div>
          </div>
        )}
        <div style={{ marginTop: 16, color: '#94a3b8' }}>
          {data.lecturerName || 'Lecturer'} · {data.academicYear || '—'} ·{' '}
          {data.submissionDate || '—'}
        </div>
      </div>
    </div>
  );

  if (data.layout === 'modern') return renderModern();
  if (data.layout === 'minimal') return renderMinimal();
  return renderClassic();
});

CoverPreview.displayName = 'CoverPreview';
export default CoverPreview;
