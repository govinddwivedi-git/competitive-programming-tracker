import React from 'react';
import Navbar from './Dashboard/Navbar'; // Original Navbar
import { SearchProvider } from './Analyser/Context/SearchContext';
import ContentProvider from './Analyser/Context/ContentContext';
import Search from './Analyser/Component/Search';
import SplitScreen from './Analyser/Content/UserProfile/Split';
import ExportAll from './Analyser/Charts/ExportAll';

const VisualForcesWrapper = () => {
  return (
    <div>
      {/* Original Navbar */}
      <Navbar />

      {/* Main Analysis Content */}
      <div className="wrapper-container">
        <div
          id="visual-forces-container"
          className="visual-forces-container"
          role="region"
          aria-label="Analysis Panel"
        >
          <SearchProvider>
            <ContentProvider>
              <Search />
              <SplitScreen />
              <ExportAll />
            </ContentProvider>
          </SearchProvider>
        </div>
      </div>

    </div>
  );
};

export default VisualForcesWrapper;
