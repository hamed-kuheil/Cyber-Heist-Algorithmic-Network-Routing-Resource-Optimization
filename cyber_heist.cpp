/*
 Cyber Heist - Analysis of Algorithms
 Team: Nour Aldin Qwaider (71604), Hamed Kuhil (71590)
 C++17. التعليقات العربية محفوظة بترميز UTF-8.
*/

#include <iostream>
#include <vector>
#include <string>
#include <queue>
#include <limits>
#include <algorithm>
#include <iomanip>
using namespace std;

const int INF = numeric_limits<int>::max() / 4;

struct Edge { int to, weight; };
struct Tool { string name; int weight, value; };
struct Result { int value = 0, weight = 0; vector<int> selected; };
struct Level {
    string name;
    int capacity, source, target;
    vector<string> names;
    vector<vector<Edge>> graph;
    vector<Tool> tools;
};

void addEdge(vector<vector<Edge>>& g, int a, int b, int w) {
    g[a].push_back({b,w});
    g[b].push_back({a,w});
}

/*
 خوارزمية Dijkstra لإيجاد أقل تكلفة من source إلى كل العقد.
 Time: O((V + E) log V) باستخدام Priority Queue مبنية على Binary Heap.
 Space: O(V + E) لتخزين الرسم البياني والمسافات والـ parent والطابور.
 V عدد العقد، E عدد الحواف. يجب أن تكون الأوزان غير سالبة.
*/
vector<int> dijkstra(const vector<vector<Edge>>& g, int source,
                     vector<int>& parent) {
    int n = (int)g.size();
    vector<int> dist(n, INF);
    parent.assign(n, -1);
    priority_queue<pair<int,int>, vector<pair<int,int>>,
                   greater<pair<int,int>>> pq;
    dist[source] = 0;
    pq.push({0, source});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d != dist[u]) continue; // تجاهل نسخة قديمة من العقدة

        // Relaxation: تحديث مسافة الجار إذا وجدنا طريقاً أقل تكلفة.
        for (const Edge& e : g[u]) {
            int candidate = dist[u] + e.weight;
            if (candidate < dist[e.to]) {
                dist[e.to] = candidate;
                parent[e.to] = u;
                pq.push({candidate, e.to});
            }
        }
    }
    return dist;
}

/*
 0/1 Knapsack باستخدام Dynamic Programming.
 dp[i][w] = أفضل قيمة بأول i أدوات وسعة لا تتجاوز w.
 Time: O(n * W) لأننا نفحص n أدوات و W سعات لكل أداة.
 Space: O(n * W) لجدول DP وإعادة بناء الأدوات المختارة.
 n عدد الأدوات، W سعة الحقيبة. التعقيد Pseudo-polynomial.
*/
Result knapsack(const vector<Tool>& tools, int capacity) {
    int n = (int)tools.size();
    vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));

    for (int i = 1; i <= n; ++i) {
        int wt = tools[i - 1].weight, val = tools[i - 1].value;
        for (int w = 0; w <= capacity; ++w) {
            dp[i][w] = dp[i - 1][w]; // لا نختار الأداة
            if (wt <= w) {
                dp[i][w] = max(dp[i][w], val + dp[i - 1][w - wt]);
            }
        }
    }

    Result r;
    r.value = dp[n][capacity];
    int w = capacity;
    // إعادة بناء العناصر التي ساهمت في الحل الأمثل.
    for (int i = n; i >= 1; --i) {
        if (dp[i][w] != dp[i - 1][w]) {
            int idx = i - 1;
            r.selected.push_back(idx);
            r.weight += tools[idx].weight;
            w -= tools[idx].weight;
        }
    }
    reverse(r.selected.begin(), r.selected.end());
    return r;
}

vector<Level> makeLevels() {
    vector<Level> ls;

    Level a{"Level 1 - Basic Infiltration", 7, 0, 4,
            {"S","A","B","C","T"}, vector<vector<Edge>>(5),
            {{"Scanner",3,7},{"Bypass Key",4,9},{"Decoy",2,4},{"Signal Jammer",5,10}}};
    addEdge(a.graph,0,1,4); addEdge(a.graph,0,2,2);
    addEdge(a.graph,2,1,1); addEdge(a.graph,1,3,3);
    addEdge(a.graph,2,3,5); addEdge(a.graph,3,4,2);
    addEdge(a.graph,2,4,9); ls.push_back(a);

    Level b{"Level 2 - Secure Data Center", 9, 0, 5,
            {"S","A","B","C","D","T"}, vector<vector<Edge>>(6),
            {{"Scanner",2,5},{"Bypass Key",5,12},{"Firewall Kit",4,10},
             {"Decoy",3,6},{"Data Extractor",6,14}}};
    addEdge(b.graph,0,1,3); addEdge(b.graph,0,2,6);
    addEdge(b.graph,1,2,2); addEdge(b.graph,1,3,5);
    addEdge(b.graph,2,3,1); addEdge(b.graph,2,4,4);
    addEdge(b.graph,3,4,2); addEdge(b.graph,3,5,7);
    addEdge(b.graph,4,5,2); ls.push_back(b);

    Level c{"Level 3 - Core Vault", 12, 0, 6,
            {"S","A","B","C","D","E","T"}, vector<vector<Edge>>(7),
            {{"Scanner",3,7},{"Bypass Key",5,12},{"Firewall Kit",4,10},
             {"Decoy",2,5},{"Data Extractor",6,15},{"Signal Jammer",7,16}}};
    addEdge(c.graph,0,1,4); addEdge(c.graph,0,2,2);
    addEdge(c.graph,1,2,1); addEdge(c.graph,1,3,5);
    addEdge(c.graph,2,3,2); addEdge(c.graph,2,4,6);
    addEdge(c.graph,3,4,1); addEdge(c.graph,3,5,4);
    addEdge(c.graph,4,5,2); addEdge(c.graph,4,6,5);
    addEdge(c.graph,5,6,2); ls.push_back(c);

    return ls;
}

void showPath(const vector<int>& parent, int s, int t, const vector<string>& names) {
    vector<int> path;
    for (int v = t; v != -1; v = parent[v]) {
        path.push_back(v);
        if (v == s) break;
    }
    if (path.back() != s) {
        cout << "No route exists.\n";
        return;
    }
    reverse(path.begin(), path.end());
    cout << "Shortest route: ";
    for (size_t i = 0; i < path.size(); ++i) {
        if (i) cout << " -> ";
        cout << names[path[i]];
    }
    cout << '\n';
}

void play(const Level& level) {
    cout << "\n=== " << level.name << " ===\n";
    cout << "Capacity: " << level.capacity << "\n\nTools:\n";
    for (size_t i = 0; i < level.tools.size(); ++i) {
        const auto& t = level.tools[i];
        cout << i+1 << ") " << left << setw(18) << t.name
             << " weight=" << t.weight << ", value=" << t.value << '\n';
    }

    cout << "\n[0/1 Knapsack] Optimal toolkit:\n";
    Result r = knapsack(level.tools, level.capacity);
    for (int i : r.selected) cout << " - " << level.tools[i].name << '\n';
    cout << "Total weight: " << r.weight << "/" << level.capacity
         << " | Total value: " << r.value << '\n';

    cout << "\n[Dijkstra] Finding the cheapest route...\n";
    vector<int> parent;
    vector<int> dist = dijkstra(level.graph, level.source, parent);
    showPath(parent, level.source, level.target, level.names);
    if (dist[level.target] == INF) cout << "Target is unreachable.\n";
    else cout << "Total route cost: " << dist[level.target] << '\n';

    cout << "\nMission completed: optimized route and toolkit calculated.\n";
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    vector<Level> levels = makeLevels();
    cout << "========================================\n"
         << " CYBER HEIST\n"
         << " Algorithmic Network Routing & Resource Optimization\n"
         << " Course: Analysis of Algorithms\n"
         << " Team: Nour Aldin Qwaider (71604), Hamed Kuhil (71590)\n"
         << "========================================\n";

    while (true) {
        cout << "\nChoose mission:\n";
        for (size_t i = 0; i < levels.size(); ++i)
            cout << i+1 << ". " << levels[i].name << '\n';
        cout << "0. Exit\nChoice: ";

        int choice;
        if (!(cin >> choice)) {
            cout << "Please enter a valid number.\n";
            return 0;
        }
        if (choice == 0) break;
        if (choice < 1 || choice > (int)levels.size()) {
            cout << "Invalid choice. Try again.\n";
            continue;
        }
        play(levels[choice - 1]);
    }
    cout << "Goodbye, operative!\n";
    return 0;
}

/*
 طريقة التجميع والتشغيل:

 Linux / macOS:
   g++ -std=c++17 -O2 -Wall -Wextra cyber_heist.cpp -o cyber_heist
   ./cyber_heist

 Windows مع MinGW:
   g++ -std=c++17 -O2 -Wall -Wextra cyber_heist.cpp -o cyber_heist.exe
   .\\cyber_heist.exe

 OnlineGDB:
   اختر C++17، الصق الكود، ثم اضغط Run.
*/
