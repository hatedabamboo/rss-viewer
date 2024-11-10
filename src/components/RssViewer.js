import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

const RssViewer = () => {
  const [url, setUrl] = useState('');
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRSS = async () => {
    if (!url) {
      setError('Please enter a RSS feed URL');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`
      );
      const data = await response.json();
      
      if (data.status === 'ok') {
        setFeeds(data.items);
        console.log(data.items);
      } else {
        setError('Could not fetch RSS feed. Please check the URL and try again.');
      }
    } catch (err) {
      setError('An error occurred while fetching the feed.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (event) => {
    event.target.style.display = 'none';
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">RSS Feed Viewer</h1>
        <div className="flex gap-4">
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter RSS feed URL"
            className="flex-1"
          />
          <Button 
            onClick={fetchRSS}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Fetch Feed'}
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>

      {feeds.length > 0 && (
        <div className="space-y-6">
          {feeds.map((item, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
              {item.enclosure?.link && (
                <div className="w-full h-64 bg-gray-100">
                  <img
                    src={item.enclosure.link}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>
              )}
              {item.thumbnail && !item.enclosure?.link && (
                <div className="w-full h-64 bg-gray-100">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">
                  <a 
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {item.title}
                  </a>
                </h2>
                {item.author && (
                  <p className="text-gray-600 text-sm mb-2">
                    By {item.author}
                  </p>
                )}
                <p className="text-gray-500 text-sm mb-4">
                  {new Date(item.pubDate).toLocaleDateString()} {new Date(item.pubDate).toLocaleTimeString()}
                </p>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RssViewer;
