"""
Single source of truth for every soccer competition in StatSphere.

football-data.org codes (free tier): PL, BL1, SA, PD, FL1, CL, EL, EC, WC
API-Football competition IDs used for everything else.
"""

# ── STRUCTURE ─────────────────────────────────────────────────────────────────
# Each entry: { id, name, short, region, tier, fd_code, apif_id, flag, domestic_cups }
# fd_code  → football-data.org code (free tier)
# apif_id  → API-Football competition ID (paid/freemium fallback)
# tier     → "international" | "continental" | "domestic_top" | "domestic_cup"

COMPETITIONS = [

    # ── INTERNATIONAL ──────────────────────────────────────────────────────────
    {"id": "world_cup",       "name": "FIFA World Cup",               "short": "WC",     "region": "World",          "tier": "international", "fd_code": "WC",   "apif_id": 1,    "flag": "🌍"},
    {"id": "euros",           "name": "UEFA European Championship",   "short": "EUROS",  "region": "Europe",         "tier": "international", "fd_code": "EC",   "apif_id": 4,    "flag": "🇪🇺"},
    {"id": "copa_america",    "name": "Copa América",                 "short": "CA",     "region": "South America",  "tier": "international", "fd_code": None,   "apif_id": 9,    "flag": "🌎"},
    {"id": "afc_asian_cup",   "name": "AFC Asian Cup",               "short": "ACC",    "region": "Asia",           "tier": "international", "fd_code": None,   "apif_id": 7,    "flag": "🌏"},
    {"id": "afcon",           "name": "Africa Cup of Nations",        "short": "AFCON",  "region": "Africa",         "tier": "international", "fd_code": None,   "apif_id": 6,    "flag": "🌍"},
    {"id": "gold_cup",        "name": "CONCACAF Gold Cup",           "short": "GOLD",   "region": "CONCACAF",       "tier": "international", "fd_code": None,   "apif_id": 16,   "flag": "🏆"},

    # ── CONTINENTAL CLUB ───────────────────────────────────────────────────────
    {"id": "ucl",             "name": "UEFA Champions League",        "short": "UCL",    "region": "Europe",         "tier": "continental",   "fd_code": "CL",   "apif_id": 2,    "flag": "⭐"},
    {"id": "uel",             "name": "UEFA Europa League",           "short": "UEL",    "region": "Europe",         "tier": "continental",   "fd_code": "EL",   "apif_id": 3,    "flag": "🟠"},
    {"id": "uecl",            "name": "UEFA Conference League",       "short": "UECL",   "region": "Europe",         "tier": "continental",   "fd_code": None,   "apif_id": 848,  "flag": "🟢"},
    {"id": "libertadores",    "name": "Copa Libertadores",            "short": "LIBERT", "region": "South America",  "tier": "continental",   "fd_code": None,   "apif_id": 13,   "flag": "🏆"},
    {"id": "sudamericana",    "name": "Copa Sudamericana",            "short": "SUDAMER","region": "South America",  "tier": "continental",   "fd_code": None,   "apif_id": 11,   "flag": "🏆"},
    {"id": "afc_cl",          "name": "AFC Champions League",         "short": "AFCCL",  "region": "Asia",           "tier": "continental",   "fd_code": None,   "apif_id": 17,   "flag": "⭐"},
    {"id": "concacaf_cc",     "name": "CONCACAF Champions Cup",       "short": "CCC",    "region": "CONCACAF",       "tier": "continental",   "fd_code": None,   "apif_id": 18,   "flag": "🏆"},

    # ── EUROPE — TOP 5 LEAGUES + DOMESTIC CUPS ─────────────────────────────────
    {"id": "epl",             "name": "Premier League",               "short": "EPL",    "region": "England",        "tier": "domestic_top",  "fd_code": "PL",   "apif_id": 39,   "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
    {"id": "fa_cup",          "name": "FA Cup",                       "short": "FA",     "region": "England",        "tier": "domestic_cup",  "fd_code": None,   "apif_id": 45,   "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
    {"id": "efl_cup",         "name": "EFL Cup (Carabao Cup)",        "short": "EFL",    "region": "England",        "tier": "domestic_cup",  "fd_code": None,   "apif_id": 48,   "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿"},

    {"id": "laliga",          "name": "La Liga",                      "short": "LL",     "region": "Spain",          "tier": "domestic_top",  "fd_code": "PD",   "apif_id": 140,  "flag": "🇪🇸"},
    {"id": "copa_del_rey",    "name": "Copa del Rey",                 "short": "CDR",    "region": "Spain",          "tier": "domestic_cup",  "fd_code": None,   "apif_id": 143,  "flag": "🇪🇸"},
    {"id": "supercopa_es",    "name": "Supercopa de España",          "short": "SCE",    "region": "Spain",          "tier": "domestic_cup",  "fd_code": None,   "apif_id": 556,  "flag": "🇪🇸"},

    {"id": "bundesliga",      "name": "Bundesliga",                   "short": "BL",     "region": "Germany",        "tier": "domestic_top",  "fd_code": "BL1",  "apif_id": 78,   "flag": "🇩🇪"},
    {"id": "dfb_pokal",       "name": "DFB-Pokal",                    "short": "DFB",    "region": "Germany",        "tier": "domestic_cup",  "fd_code": None,   "apif_id": 81,   "flag": "🇩🇪"},

    {"id": "serie_a",         "name": "Serie A",                      "short": "SA",     "region": "Italy",          "tier": "domestic_top",  "fd_code": "SA",   "apif_id": 135,  "flag": "🇮🇹"},
    {"id": "coppa_italia",    "name": "Coppa Italia",                 "short": "CI",     "region": "Italy",          "tier": "domestic_cup",  "fd_code": None,   "apif_id": 137,  "flag": "🇮🇹"},

    {"id": "ligue1",          "name": "Ligue 1",                      "short": "L1",     "region": "France",         "tier": "domestic_top",  "fd_code": "FL1",  "apif_id": 61,   "flag": "🇫🇷"},
    {"id": "coupe_de_france", "name": "Coupe de France",              "short": "CDF",    "region": "France",         "tier": "domestic_cup",  "fd_code": None,   "apif_id": 66,   "flag": "🇫🇷"},

    # ── EUROPE — OTHER LEAGUES ─────────────────────────────────────────────────
    {"id": "liga_portugal",   "name": "Liga Portugal (Primeira Liga)","short": "LP",     "region": "Portugal",       "tier": "domestic_top",  "fd_code": None,   "apif_id": 94,   "flag": "🇵🇹"},
    {"id": "taca_portugal",   "name": "Taça de Portugal",             "short": "TCP",    "region": "Portugal",       "tier": "domestic_cup",  "fd_code": None,   "apif_id": 96,   "flag": "🇵🇹"},

    {"id": "eredivisie",      "name": "Eredivisie",                   "short": "ERE",    "region": "Netherlands",    "tier": "domestic_top",  "fd_code": None,   "apif_id": 88,   "flag": "🇳🇱"},
    {"id": "knvb_cup",        "name": "KNVB Cup",                     "short": "KNVB",   "region": "Netherlands",    "tier": "domestic_cup",  "fd_code": None,   "apif_id": 90,   "flag": "🇳🇱"},

    {"id": "belgian_pl",      "name": "Belgian Pro League",           "short": "BEL",    "region": "Belgium",        "tier": "domestic_top",  "fd_code": None,   "apif_id": 144,  "flag": "🇧🇪"},
    {"id": "belgian_cup",     "name": "Belgian Cup",                  "short": "BELC",   "region": "Belgium",        "tier": "domestic_cup",  "fd_code": None,   "apif_id": 147,  "flag": "🇧🇪"},

    {"id": "super_lig",       "name": "Süper Lig",                    "short": "SL",     "region": "Turkey",         "tier": "domestic_top",  "fd_code": None,   "apif_id": 203,  "flag": "🇹🇷"},
    {"id": "turkish_cup",     "name": "Turkish Cup",                  "short": "TC",     "region": "Turkey",         "tier": "domestic_cup",  "fd_code": None,   "apif_id": 205,  "flag": "🇹🇷"},

    {"id": "scottish_pl",     "name": "Scottish Premiership",         "short": "SPL",    "region": "Scotland",       "tier": "domestic_top",  "fd_code": None,   "apif_id": 179,  "flag": "🏴󠁧󠁢󠁳󠁣󠁴󠁿"},
    {"id": "scottish_cup",    "name": "Scottish Cup",                 "short": "SC",     "region": "Scotland",       "tier": "domestic_cup",  "fd_code": None,   "apif_id": 181,  "flag": "🏴󠁧󠁢󠁳󠁣󠁴󠁿"},
    {"id": "scottish_lc",     "name": "Scottish League Cup",          "short": "SLC",    "region": "Scotland",       "tier": "domestic_cup",  "fd_code": None,   "apif_id": 182,  "flag": "🏴󠁧󠁢󠁳󠁣󠁴󠁿"},

    # ── NORTH/CENTRAL AMERICA ─────────────────────────────────────────────────
    {"id": "mls",             "name": "Major League Soccer",          "short": "MLS",    "region": "USA",            "tier": "domestic_top",  "fd_code": None,   "apif_id": 253,  "flag": "🇺🇸"},
    {"id": "us_open_cup",     "name": "U.S. Open Cup",                "short": "USOC",   "region": "USA",            "tier": "domestic_cup",  "fd_code": None,   "apif_id": 257,  "flag": "🇺🇸"},
    {"id": "mls_cup",         "name": "MLS Cup Playoffs",             "short": "MLSCP",  "region": "USA",            "tier": "domestic_cup",  "fd_code": None,   "apif_id": 254,  "flag": "🇺🇸"},

    {"id": "liga_mx",         "name": "Liga MX",                      "short": "LMX",    "region": "Mexico",         "tier": "domestic_top",  "fd_code": None,   "apif_id": 262,  "flag": "🇲🇽"},
    {"id": "copa_mx",         "name": "Copa MX",                      "short": "CMX",    "region": "Mexico",         "tier": "domestic_cup",  "fd_code": None,   "apif_id": 265,  "flag": "🇲🇽"},

    {"id": "canadian_pl",     "name": "Canadian Premier League",      "short": "CPL",    "region": "Canada",         "tier": "domestic_top",  "fd_code": None,   "apif_id": 719,  "flag": "🇨🇦"},
    {"id": "canadian_cup",    "name": "Canadian Championship",        "short": "CCAN",   "region": "Canada",         "tier": "domestic_cup",  "fd_code": None,   "apif_id": 720,  "flag": "🇨🇦"},

    {"id": "primera_sv",      "name": "Primera División El Salvador", "short": "SLV",    "region": "El Salvador",    "tier": "domestic_top",  "fd_code": None,   "apif_id": 769,  "flag": "🇸🇻"},
    {"id": "primera_cr",      "name": "Primera División Costa Rica",  "short": "CRI",    "region": "Costa Rica",     "tier": "domestic_top",  "fd_code": None,   "apif_id": 774,  "flag": "🇨🇷"},
    {"id": "liga_hn",         "name": "Liga Nacional Honduras",       "short": "HND",    "region": "Honduras",       "tier": "domestic_top",  "fd_code": None,   "apif_id": 779,  "flag": "🇭🇳"},
    {"id": "liga_gt",         "name": "Liga Nacional Guatemala",      "short": "GTM",    "region": "Guatemala",      "tier": "domestic_top",  "fd_code": None,   "apif_id": 785,  "flag": "🇬🇹"},
    {"id": "lpf_pa",          "name": "Liga Panameña de Fútbol",      "short": "PAN",    "region": "Panama",         "tier": "domestic_top",  "fd_code": None,   "apif_id": 790,  "flag": "🇵🇦"},
    {"id": "liga_ni",         "name": "Liga Nicaragüense de Fútbol",  "short": "NIC",    "region": "Nicaragua",      "tier": "domestic_top",  "fd_code": None,   "apif_id": 796,  "flag": "🇳🇮"},

    # ── SOUTH AMERICA ──────────────────────────────────────────────────────────
    {"id": "arg_liga",        "name": "Liga Profesional Argentina",   "short": "ARG",    "region": "Argentina",      "tier": "domestic_top",  "fd_code": None,   "apif_id": 128,  "flag": "🇦🇷"},
    {"id": "copa_arg",        "name": "Copa Argentina",               "short": "CARG",   "region": "Argentina",      "tier": "domestic_cup",  "fd_code": None,   "apif_id": 130,  "flag": "🇦🇷"},

    {"id": "bol_liga",        "name": "División Profesional Bolivia", "short": "BOL",    "region": "Bolivia",        "tier": "domestic_top",  "fd_code": None,   "apif_id": 192,  "flag": "🇧🇴"},

    {"id": "bra_serie_a",     "name": "Brasileirão Série A",          "short": "BSA",    "region": "Brazil",         "tier": "domestic_top",  "fd_code": None,   "apif_id": 71,   "flag": "🇧🇷"},
    {"id": "copa_brasil",     "name": "Copa do Brasil",               "short": "CDB",    "region": "Brazil",         "tier": "domestic_cup",  "fd_code": None,   "apif_id": 73,   "flag": "🇧🇷"},

    {"id": "chi_primera",     "name": "Primera División Chile",       "short": "CHI",    "region": "Chile",          "tier": "domestic_top",  "fd_code": None,   "apif_id": 208,  "flag": "🇨🇱"},
    {"id": "copa_chile",      "name": "Copa Chile",                   "short": "CCHI",   "region": "Chile",          "tier": "domestic_cup",  "fd_code": None,   "apif_id": 209,  "flag": "🇨🇱"},

    {"id": "col_liga",        "name": "Liga BetPlay (Categoría 1A)",  "short": "COL",    "region": "Colombia",       "tier": "domestic_top",  "fd_code": None,   "apif_id": 239,  "flag": "🇨🇴"},
    {"id": "copa_col",        "name": "Copa Colombia",                "short": "CCOL",   "region": "Colombia",       "tier": "domestic_cup",  "fd_code": None,   "apif_id": 241,  "flag": "🇨🇴"},

    {"id": "ecu_ligapro",     "name": "LigaPro Serie A Ecuador",      "short": "ECU",    "region": "Ecuador",        "tier": "domestic_top",  "fd_code": None,   "apif_id": 245,  "flag": "🇪🇨"},

    {"id": "par_apf",         "name": "Copa de Primera Paraguay",     "short": "PAR",    "region": "Paraguay",       "tier": "domestic_top",  "fd_code": None,   "apif_id": 242,  "flag": "🇵🇾"},

    {"id": "per_liga1",       "name": "Liga 1 Perú",                  "short": "PER",    "region": "Peru",           "tier": "domestic_top",  "fd_code": None,   "apif_id": 243,  "flag": "🇵🇪"},

    {"id": "uru_primera",     "name": "Campeonato Uruguayo",          "short": "URU",    "region": "Uruguay",        "tier": "domestic_top",  "fd_code": None,   "apif_id": 268,  "flag": "🇺🇾"},

    {"id": "ven_futve",       "name": "Liga FUTVE Venezuela",         "short": "VEN",    "region": "Venezuela",      "tier": "domestic_top",  "fd_code": None,   "apif_id": 244,  "flag": "🇻🇪"},
]

# Build lookup maps
BY_ID     = {c["id"]: c  for c in COMPETITIONS}
BY_FD     = {c["fd_code"]: c for c in COMPETITIONS if c["fd_code"]}
BY_REGION = {}
for c in COMPETITIONS:
    BY_REGION.setdefault(c["region"], []).append(c)

# Navigation groups for the frontend
NAV_GROUPS = [
    {"label": "International",     "ids": ["world_cup","euros","copa_america","afc_asian_cup","afcon","gold_cup"]},
    {"label": "Continental clubs", "ids": ["ucl","uel","uecl","libertadores","sudamericana","afc_cl","concacaf_cc"]},
    {"label": "England",           "ids": ["epl","fa_cup","efl_cup"]},
    {"label": "Spain",             "ids": ["laliga","copa_del_rey","supercopa_es"]},
    {"label": "Germany",           "ids": ["bundesliga","dfb_pokal"]},
    {"label": "Italy",             "ids": ["serie_a","coppa_italia"]},
    {"label": "France",            "ids": ["ligue1","coupe_de_france"]},
    {"label": "Portugal",          "ids": ["liga_portugal","taca_portugal"]},
    {"label": "Netherlands",       "ids": ["eredivisie","knvb_cup"]},
    {"label": "Belgium",           "ids": ["belgian_pl","belgian_cup"]},
    {"label": "Turkey",            "ids": ["super_lig","turkish_cup"]},
    {"label": "Scotland",          "ids": ["scottish_pl","scottish_cup","scottish_lc"]},
    {"label": "USA",               "ids": ["mls","us_open_cup","mls_cup"]},
    {"label": "Mexico",            "ids": ["liga_mx","copa_mx"]},
    {"label": "Canada",            "ids": ["canadian_pl","canadian_cup"]},
    {"label": "Central America",   "ids": ["primera_sv","primera_cr","liga_hn","liga_gt","lpf_pa","liga_ni"]},
    {"label": "Argentina",         "ids": ["arg_liga","copa_arg"]},
    {"label": "Brazil",            "ids": ["bra_serie_a","copa_brasil"]},
    {"label": "Colombia",          "ids": ["col_liga","copa_col"]},
    {"label": "Chile",             "ids": ["chi_primera","copa_chile"]},
    {"label": "South America",     "ids": ["bol_liga","ecu_ligapro","par_apf","per_liga1","uru_primera","ven_futve","libertadores","sudamericana"]},
]
