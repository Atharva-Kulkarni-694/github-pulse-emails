
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { GitCommit, Star, GitFork, Eye, RefreshCw, Clock, ExternalLink } from 'lucide-react';

interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    name: string;
    url: string;
  };
  payload: any;
  created_at: string;
}

export const GitHubTimeline = () => {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchGitHubTimeline = async () => {
    try {
      setLoading(true);
      // Simulating GitHub API call with mock data
      const mockEvents: GitHubEvent[] = [
        {
          id: '1',
          type: 'PushEvent',
          actor: {
            login: 'octocat',
            avatar_url: 'https://github.com/octocat.png'
          },
          repo: {
            name: 'octocat/Hello-World',
            url: 'https://github.com/octocat/Hello-World'
          },
          payload: {
            commits: [
              { message: 'Add new feature for user authentication' }
            ]
          },
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          type: 'WatchEvent',
          actor: {
            login: 'defunkt',
            avatar_url: 'https://github.com/defunkt.png'
          },
          repo: {
            name: 'rails/rails',
            url: 'https://github.com/rails/rails'
          },
          payload: {},
          created_at: new Date(Date.now() - 300000).toISOString()
        },
        {
          id: '3',
          type: 'ForkEvent',
          actor: {
            login: 'mojombo',
            avatar_url: 'https://github.com/mojombo.png'
          },
          repo: {
            name: 'microsoft/vscode',
            url: 'https://github.com/microsoft/vscode'
          },
          payload: {},
          created_at: new Date(Date.now() - 600000).toISOString()
        },
        {
          id: '4',
          type: 'IssuesEvent',
          actor: {
            login: 'pjhyett',
            avatar_url: 'https://github.com/pjhyett.png'
          },
          repo: {
            name: 'facebook/react',
            url: 'https://github.com/facebook/react'
          },
          payload: {
            action: 'opened',
            issue: {
              title: 'Bug: Component not rendering correctly'
            }
          },
          created_at: new Date(Date.now() - 900000).toISOString()
        }
      ];

      setEvents(mockEvents);
      setLastUpdate(new Date());
      
      if (lastUpdate) {
        toast({
          title: "Timeline Updated",
          description: "Latest GitHub activity has been fetched",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch GitHub timeline",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGitHubTimeline();
    
    // Simulate CRON job - fetch updates every 5 minutes
    const interval = setInterval(fetchGitHubTimeline, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PushEvent':
        return <GitCommit className="h-4 w-4" />;
      case 'WatchEvent':
        return <Star className="h-4 w-4" />;
      case 'ForkEvent':
        return <GitFork className="h-4 w-4" />;
      case 'IssuesEvent':
        return <Eye className="h-4 w-4" />;
      default:
        return <GitCommit className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'PushEvent':
        return 'bg-green-100 text-green-800';
      case 'WatchEvent':
        return 'bg-yellow-100 text-yellow-800';
      case 'ForkEvent':
        return 'bg-blue-100 text-blue-800';
      case 'IssuesEvent':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventDescription = (event: GitHubEvent) => {
    switch (event.type) {
      case 'PushEvent':
        return `pushed ${event.payload.commits?.length || 1} commit(s)`;
      case 'WatchEvent':
        return 'starred';
      case 'ForkEvent':
        return 'forked';
      case 'IssuesEvent':
        return `${event.payload.action} an issue`;
      default:
        return 'performed an action on';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">GitHub Timeline</h2>
        <div className="flex items-center space-x-4">
          {lastUpdate && (
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Clock className="h-4 w-4" />
              <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchGitHubTimeline}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {loading && events.length === 0 ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow duration-200 border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={event.actor.avatar_url}
                    alt={event.actor.login}
                    className="w-10 h-10 rounded-full ring-2 ring-slate-100"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className={`${getEventColor(event.type)} border-0`}>
                        {getEventIcon(event.type)}
                        <span className="ml-1">{event.type.replace('Event', '')}</span>
                      </Badge>
                      <span className="text-sm text-slate-500">
                        {formatTimeAgo(event.created_at)}
                      </span>
                    </div>
                    <p className="text-slate-700">
                      <span className="font-medium">{event.actor.login}</span>
                      {' '}
                      <span>{getEventDescription(event)}</span>
                      {' '}
                      <a
                        href={event.repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800 inline-flex items-center"
                      >
                        {event.repo.name}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </p>
                    {event.type === 'PushEvent' && event.payload.commits?.[0] && (
                      <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                        "{event.payload.commits[0].message}"
                      </p>
                    )}
                    {event.type === 'IssuesEvent' && event.payload.issue && (
                      <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                        "{event.payload.issue.title}"
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
